import { query } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const get = query({
        args: {},
        handler: async (ctx) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                return await ctx.db
                        .query("cards")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();
        },
});
