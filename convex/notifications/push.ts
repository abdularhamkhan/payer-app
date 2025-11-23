import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";

/**
 * push notification to a user (can be used server-side or by mutations)
 * note: push to device / external APNs/FCM not implemented here.
 */
export const push = mutation({
        args: {
                userId: v.id("users"),
                title: v.string(),
                message: v.string(),
        },
        handler: async (ctx, { userId, title, message }) => {
                const id = await ctx.db.insert("notifications", {
                        userId,
                        title,
                        message,
                        read: false,
                        createdAt: Date.now(),
                });

                await audit(ctx, userId, "notification_push", { id, title });

                // TODO: integrate with FCM/APNs (send push to device tokens)

                return { id };
        },
});
