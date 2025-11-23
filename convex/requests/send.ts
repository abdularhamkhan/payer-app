// convex/requests/send.ts
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

/**
 * Small heuristic to detect Convex Id strings.
 * Convex ids typically contain '::' (e.g. "users::xxxxxx").
 */
function isConvexId(value: string): boolean {
        return value.includes("::");
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

                // Resolve recipient: try normalized phone first (most common),
                // then fallback to direct id lookup (if it looks like a convex id).
                let toUser = null;

                // If input looks like a normalized phone (starts with digits) or random string,
                // prefer index lookup; otherwise if it's a convex id try db.get.
                // We'll attempt index lookup first for safety/performance.
                const byPhoneLookup = await ctx.db
                        .query("users")
                        .withIndex("by_normalizedPhone", (q) => q.eq("normalizedPhone", toPhoneOrId))
                        .unique();

                if (byPhoneLookup) {
                        toUser = byPhoneLookup;
                } else if (isConvexId(toPhoneOrId)) {
                        // safe to use db.get — Convex requires an Id type; cast to any to satisfy TS here.
                        // This is a runtime operation so it will fail if id is invalid.
                        try {
                                toUser = await ctx.db.get(toPhoneOrId as any);
                        } catch (err) {
                                // If db.get throws, we treat as not found and report below.
                                toUser = null;
                        }
                } else {
                        // not a convex id and phone lookup returned nothing -> not found
                        toUser = null;
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
