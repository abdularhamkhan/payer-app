import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

export const accept = mutation({
        args: {
                requestId: v.id("requests"),
        },
        handler: async (ctx, { requestId }) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                const request = await ctx.db.get(requestId);
                if (!request) throw new Error("Request not found");
                if (request.toUserId !== userId) throw new Error("Not authorized to accept");

                if (request.status !== "PENDING") throw new Error("Request already handled");

                // Fetch wallets
                const fromUserWallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", request.fromUserId))
                        .unique();
                const toUserWallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", request.toUserId))
                        .unique();

                if (!fromUserWallet || !toUserWallet) throw new Error("Wallet missing for one of the users");

                // Check balance (payer is the toUser who accepts — they pay out)
                const payerWallet = toUserWallet;
                if (payerWallet.balance < request.amount) throw new Error("Insufficient balance");

                // Atomic updates (patch both wallets, insert transaction)
                const newPayerBalance = payerWallet.balance - request.amount;
                const newReceiverBalance = fromUserWallet.balance + request.amount;

                await ctx.db.patch(payerWallet._id, { balance: newPayerBalance, updatedAt: Date.now() });
                await ctx.db.patch(fromUserWallet._id, { balance: newReceiverBalance, updatedAt: Date.now() });

                // Insert transactions for both sides
                await ctx.db.insert("transactions", {
                        userId: request.toUserId,
                        walletId: payerWallet._id,
                        amount: -request.amount,
                        type: "DEBIT",
                        description: `Payment for request ${requestId}`,
                        method: "REQUEST_PAY",
                        toUserId: request.fromUserId,
                        fromUserId: request.toUserId,
                        status: "SUCCESS",
                        createdAt: Date.now(),
                });

                await ctx.db.insert("transactions", {
                        userId: request.fromUserId,
                        walletId: fromUserWallet._id,
                        amount: request.amount,
                        type: "CREDIT",
                        description: `Received payment for request ${requestId}`,
                        method: "REQUEST_PAY",
                        toUserId: request.fromUserId,
                        fromUserId: request.toUserId,
                        status: "SUCCESS",
                        createdAt: Date.now(),
                });

                await ctx.db.patch(requestId, { status: "ACCEPTED" });

                await audit(ctx, userId, "request_accepted", { requestId, amount: request.amount });

                await ctx.db.insert("notifications", {
                        userId: request.fromUserId,
                        title: "Request accepted",
                        message: `${user.fullName ?? "Someone"} accepted your request of ${request.amount}`,
                        read: false,
                        createdAt: Date.now(),
                });

                return { success: true };
        },
});
