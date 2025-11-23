import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const transfer = mutation({
        args: {
                toUserId: v.id("users"),
                amount: v.number(),
                description: v.optional(v.string()),
        },
        handler: async (ctx, { toUserId, amount, description }) => {
                if (amount <= 0) throw new Error("Invalid amount");

                const fromUser = await getConvexUser(ctx);
                const fromUserId = fromUser._id;

                if (fromUserId === toUserId) throw new Error("Cannot send to yourself");

                // Sender wallet
                const senderWallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", fromUserId))
                        .unique();
                if (!senderWallet) throw new Error("Sender wallet missing");

                if (senderWallet.balance < amount)
                        throw new Error("Insufficient balance");

                // Receiver wallet
                const receiverWallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", toUserId))
                        .unique();
                if (!receiverWallet) throw new Error("Receiver wallet not found");

                // Atomic updates
                await ctx.db.patch(senderWallet._id, {
                        balance: senderWallet.balance - amount,
                        updatedAt: Date.now(),
                });

                await ctx.db.patch(receiverWallet._id, {
                        balance: receiverWallet.balance + amount,
                        updatedAt: Date.now(),
                });

                const now = Date.now();

                // Log DEBIT for sender
                await ctx.db.insert("transactions", {
                        userId: fromUserId,
                        walletId: senderWallet._id,
                        amount: -amount,
                        type: "DEBIT",
                        description,
                        method: "transfer",
                        toUserId,
                        status: "SUCCESS",
                        createdAt: now,
                });

                // Log CREDIT for receiver
                await ctx.db.insert("transactions", {
                        userId: toUserId,
                        walletId: receiverWallet._id,
                        amount,
                        type: "CREDIT",
                        description,
                        method: "transfer",
                        fromUserId,
                        status: "SUCCESS",
                        createdAt: now,
                });

                return { success: true };
        },
});

/**
 * User → another user (P2P)
 * Rules:
 * deduct from sender
 * add to receiver
 * log 2 transactions: DEBIT + CREDIT
 */