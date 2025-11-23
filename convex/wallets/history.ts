// convex/wallets/history.ts
import { v } from "convex/values";
import { query } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const history = query({
        args: {
                limit: v.optional(v.number()),
        },
        handler: async (ctx, { limit = 20 }) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                // fetch wallet
                const wallet = await ctx.db
                        .query("wallets")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (!wallet) return [];

                // get latest transactions
                return await ctx.db
                        .query("transactions")
                        .withIndex("by_wallet", (q) => q.eq("walletId", wallet._id))
                        .order("desc")
                        .take(limit);
        },
});
