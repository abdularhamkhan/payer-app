import { query } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const get = query({
        handler: async (ctx) => {
                const user = await getConvexUser(ctx);
                const settings = await ctx.db
                        .query("user_settings")
                        .withIndex("by_user", (q) => q.eq("userId", user._id))
                        .unique();
                return settings;
        },
});
