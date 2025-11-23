import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

/**
 * audit(...) helper to be used by other server files.
 * This helper can be imported and used in mutations to append audit logs.
 *
 * NOTE: This file exports a function `audit` (callable server-side),
 * and also exports a mutation `create` so you can call it directly if needed.
 */

// server-side helper (not exported to client)
export async function audit(ctx: any, userId: any, action: string, payload: any = {}) {
        try {
                await ctx.db.insert("audit_logs", {
                        userId,
                        action,
                        payload,
                        createdAt: Date.now(),
                });
        } catch (e) {
                // swallow errors to avoid breaking main flows; optionally log somewhere
                console.error("audit failed", e);
        }
}

// optional mutation to create audit logs directly (if you want)
export const create = mutation({
        args: {
                userId: v.id("users"),
                action: v.string(),
                payload: v.optional(v.any()),
        },
        handler: async (ctx, { userId, action, payload = null }) => {
                const id = await ctx.db.insert("audit_logs", {
                        userId,
                        action,
                        payload,
                        createdAt: Date.now(),
                });
                return { id };
        },
});

// list audit logs (restricted — use carefully)
export const list = query({
        args: {
                limit: v.optional(v.number()),
        },
        handler: async (ctx, { limit = 100 }) => {
                const identity = await ctx.auth.getUserIdentity();
                if (!identity) throw new Error("Not authenticated");
                // Only allow self or admins — here we only return user's own logs
                const user = await ctx.db
                        .query("users")
                        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", identity.subject))
                        .unique();
                if (!user) throw new Error("User not found");

                return ctx.db
                        .query("audit_logs")
                        .withIndex("by_user", (q) => q.eq("userId", user._id))
                        .order("desc")
                        .take(limit);
        },
});
