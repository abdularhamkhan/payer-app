import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

export const markRead = mutation({
        args: {
                notificationId: v.id("notifications"),
                read: v.boolean(),
        },
        handler: async (ctx, { notificationId, read }) => {
                const user = await getConvexUser(ctx);
                const n = await ctx.db.get(notificationId);
                if (!n) throw new Error("Notification not found");
                if (n.userId !== user._id) throw new Error("Not authorized");

                await ctx.db.patch(notificationId, { read });

                await audit(ctx, user._id, "notification_read_toggled", { notificationId, read });

                return { success: true };
        },
});
