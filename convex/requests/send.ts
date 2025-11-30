// convex/requests/send.ts
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

/**
 * Small heuristic to detect Convex Id strings.
 * Convex ids are alphanumeric strings without special chars
 */
function isConvexId(value: string): boolean {
        // Check if it's a long alphanumeric string (Convex ID format)
        return /^[a-z0-9]{20,}$/i.test(value);
}

export const send = mutation({
        args: {
                toPhoneOrId: v.string(), // either normalizedPhone or direct user id string
                amount: v.number(),
                note: v.optional(v.string()),
        },
        handler: async (ctx, { toPhoneOrId, amount, note }) => {
                if (amount <= 0) throw new Error("Invalid amount");

                const fromUser = await getConvexUser(ctx);
                const fromId = fromUser._id;

		// Resolve recipient: try ID first (if it looks like convex ID), then phone
		let toUser = null;
		
		if (isConvexId(toPhoneOrId)) {
			// Try as direct ID first
			try {
				const userById = await ctx.db.get(toPhoneOrId as any);
				if (userById && 'clerkUserId' in userById) {
					toUser = userById as any;
				}
			} catch (err) {
				// ID lookup failed
				toUser = null;
			}
		}
		
		// Fallback to phone lookup if ID didn't work
		if (!toUser) {
			const byPhoneLookup = await ctx.db
				.query("users")
				.withIndex("by_normalizedPhone", (q) => q.eq("normalizedPhone", toPhoneOrId))
				.first();
			toUser = byPhoneLookup;
		}

		if (!toUser) throw new Error("Recipient not found");

                // Prevent requests to self
                // Compare via string coercion to avoid opaque-id issues
                if (String(toUser._id) === String(fromId)) {
                        throw new Error("Cannot request money from yourself");
                }

                // Insert request. Use undefined for optional note field (Convex optional).
                const requestId = await ctx.db.insert("requests", {
                        fromUserId: fromId,
                        toUserId: toUser._id,
                        amount,
                        status: "PENDING",
                        createdAt: Date.now(),
                        note: note ?? undefined,
                        // rejectedReason is optional in schema — don't set here
                });

                // Audit and notification
                await audit(ctx, fromId, "request_sent", { requestId, to: toUser._id, amount });

                await ctx.db.insert("notifications", {
                        userId: toUser._id,
                        title: "Payment request",
                        message: `${fromUser.fullName ?? "Someone"} requested ${amount}`,
                        read: false,
                        createdAt: Date.now(),
                });

                return { requestId };
        },
});
