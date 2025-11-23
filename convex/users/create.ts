import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { normalizePhone } from "../utils/normalizePhone";

export const create = mutation({
        args: {
                clerkUserId: v.string(),
                phone: v.string(),
                fullName: v.string(),
                email: v.optional(v.string()),
                avatar: v.optional(v.string()),
        },

        handler: async (ctx, args) => {
                const normalizedPhone = normalizePhone(args.phone);

                // Prevent duplicates (important)
                const existing = await ctx.db
                        .query("users")
                        .withIndex("by_clerkUserId", q => q.eq("clerkUserId", args.clerkUserId))
                        .unique();

                if (existing) return existing._id; // Return existing userId

                const userId = await ctx.db.insert("users", {
                        ...args,
                        normalizedPhone,
                        isVerified: true,
                        createdAt: Date.now(),
                });

                // Create default settings
                await ctx.db.insert("user_settings", {
                        userId,
                        darkMode: false,
                        language: "en",
                        pushNotifications: true,
                });

                return userId;
        }
});
