// convex/wallets/withdraw.ts
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const withdraw = mutation({
        args: {
                amount: v.number(),
                method: v.string(),
        },
        handler: async (ctx, { amount, method }) => {
                if (amount <= 0) throw new Error("Invalid amount");

                const user = await getConvexUser(ctx);
                const userId = user._id;

                const wallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (!wallet) throw new Error("Wallet does not exist");
                if (amount > wallet.balance) throw new Error("Insufficient balance");

                const newBalance = wallet.balance - amount;

                await ctx.db.patch(wallet._id, {
                        balance: newBalance,
                        updatedAt: Date.now(),
                });

                await ctx.db.insert("transactions", {
                        userId,
                        walletId: wallet._id,
                        type: "DEBIT",
                        method,
                        amount,
                        status: "SUCCESS",
                        createdAt: Date.now(),
                });

                return { balance: newBalance };
        },
});
