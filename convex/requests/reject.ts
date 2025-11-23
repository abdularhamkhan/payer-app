import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

export const reject = mutation({
        args: {
                requestId: v.id("requests"),
                reason: v.optional(v.string()),
        },
        handler: async (ctx, { requestId, reason }) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                const request = await ctx.db.get(requestId);
                if (!request) throw new Error("Request not found");
                if (request.toUserId !== userId) throw new Error("Not authorized to reject");

                if (request.status !== "PENDING") throw new Error("Request already handled");

                await ctx.db.patch(requestId, {
                        status: "REJECTED",
                        rejectedReason: reason ?? undefined,
                });


                await audit(ctx, userId, "request_rejected", { requestId, reason });

                await ctx.db.insert("notifications", {
                        userId: request.fromUserId,
                        title: "Request rejected",
                        message: `${user.fullName ?? "Someone"} rejected your request.`,
                        read: false,
                        createdAt: Date.now(),
                });

                return { success: true };
        },
});
