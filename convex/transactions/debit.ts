import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const debit = mutation({
        args: {
                amount: v.number(),
                description: v.optional(v.string()),
                categoryId: v.optional(v.id("categories")),
                method: v.string(),
        },
        handler: async (ctx, args) => {
                const { amount, description, categoryId, method } = args;

                if (amount <= 0) throw new Error("Invalid amount");

                const user = await getConvexUser(ctx);
                const userId = user._id;

                const wallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();
                if (!wallet) throw new Error("Wallet not found");

                if (wallet.balance < amount) throw new Error("Insufficient balance");

                const newBalance = wallet.balance - amount;

                await ctx.db.patch(wallet._id, {
                        balance: newBalance,
                        updatedAt: Date.now(),
                });

                await ctx.db.insert("transactions", {
                        userId,
                        walletId: wallet._id,
                        amount: -amount,
                        type: "DEBIT",
                        description,
                        categoryId,
                        method,
                        status: "SUCCESS",
                        createdAt: Date.now(),
                });

                return { balance: newBalance };
        },
});


//--------debit = remove money from wallet.