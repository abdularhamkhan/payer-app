import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const markAllRead = mutation({
	handler: async (ctx) => {
		const user = await getConvexUser(ctx);
		
		const unreadNotifications = await ctx.db
			.query("notifications")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.filter((q) => q.eq(q.field("read"), false))
			.collect();
		
		for (const notification of unreadNotifications) {
			await ctx.db.patch(notification._id, {
				read: true,
			});
		}
		
		return { count: unreadNotifications.length };
	},
});
