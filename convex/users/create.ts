import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { normalizePhone } from "../utils/normalizePhone";

export const create = mutation({
        args: {
                clerkUserId: v.string(),
                phone: v.optional(v.string()),
                fullName: v.string(),
                firstName: v.optional(v.string()),
                lastName: v.optional(v.string()),
                email: v.optional(v.string()),
                avatar: v.optional(v.string()),
        },

        handler: async (ctx, args) => {
                const normalizedPhone = args.phone ? normalizePhone(args.phone) : undefined;

                // Prevent duplicates (important)
                const existing = await ctx.db
                        .query("users")
                        .withIndex("by_clerkUserId", q => q.eq("clerkUserId", args.clerkUserId))
                        .unique();

                if (existing) return existing._id; // Return existing userId

                const userId = await ctx.db.insert("users", {
                        clerkUserId: args.clerkUserId,
                        phone: args.phone,
                        normalizedPhone,
                        fullName: args.fullName,
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        avatar: args.avatar,
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
