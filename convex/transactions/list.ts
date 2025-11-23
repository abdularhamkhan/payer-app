import { v } from "convex/values";
import { query } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const list = query({
  args: {
    cursor: v.optional(v.number()),
    limit: v.number(),
  },

  handler: async (ctx, { cursor, limit }) => {
    const user = await getConvexUser(ctx);
    const userId = user._id;

    // Order by _creationTime descending using compound index (userId, _creationTime)
    const results = cursor !== undefined
      ? await ctx.db
          .query("transactions")
          .withIndex("by_user", (ix) => ix.eq("userId", userId).lt("_creationTime", cursor))
          .order("desc")
          .take(limit)
      : await ctx.db
          .query("transactions")
          .withIndex("by_user", (ix) => ix.eq("userId", userId))
          .order("desc")
          .take(limit);

    return {
      items: results,
      nextCursor: results.length === limit ? results[results.length - 1]._creationTime : undefined,
    };
  },
});
