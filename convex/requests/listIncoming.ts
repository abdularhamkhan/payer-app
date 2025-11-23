import { v } from "convex/values";
import { query } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const listIncoming = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    const user = await getConvexUser(ctx);
    const uid = user._id;

    return ctx.db
      .query("requests")
      .withIndex("by_to_user", (q) => q.eq("toUserId", uid))
      .order("desc")
      .take(limit);
  },
});
