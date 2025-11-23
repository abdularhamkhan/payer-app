// convex/wallets/create.ts
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const create = mutation({
        args: {},
        handler: async (ctx) => {


                const user = await getConvexUser(ctx);
                const userId = user._id;

                // Check if wallet already exists
                const existing = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (existing) {
                        return existing._id; // Already created
                }

                const walletId = await ctx.db.insert("wallets", {
                        userId,
                        iban: `PK00-${userId}`,
                        balance: 10000,
                        currency: "PKR",
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                });

                return walletId;
        },
});
