// convex/wallets/topup.ts
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const topup = mutation({
        args: {
                amount: v.number(),
                source: v.string(),
        },
        handler: async (ctx, { amount, source }) => {
                if (amount <= 0) throw new Error("Invalid amount");
                if (amount > 50000) throw new Error("Amount exceeds top-up limit");

                const user = await getConvexUser(ctx);
                const userId = user._id;

                const wallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (!wallet) throw new Error("Wallet does not exist");

                const newBalance = wallet.balance + amount;

                await ctx.db.patch(wallet._id, {
                        balance: newBalance,
                        updatedAt: Date.now(),
                });

                await ctx.db.insert("transactions", {
                        userId,
                        walletId: wallet._id,
                        type: "CREDIT",
                        method: source,
                        amount,
                        status: "SUCCESS",
                        createdAt: Date.now(),
                });

                return { balance: newBalance };
        },
});
