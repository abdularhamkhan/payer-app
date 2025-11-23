import { v } from "convex/values";
import { query } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const list = query({
        args: {
                limit: v.optional(v.number()),
        },
        handler: async (ctx, { limit = 50 }) => {
                const user = await getConvexUser(ctx);
                return ctx.db
                        .query("notifications")
                        .withIndex("by_user", (q) => q.eq("userId", user._id))
                        .order("desc")
                        .take(limit);
        },
});
