import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const update = mutation({
        args: {
                fullName: v.optional(v.string()),
                avatar: v.optional(v.string()),
                email: v.optional(v.string()),
        },

        handler: async (ctx, args) => {
                const identity = await ctx.auth.getUserIdentity();
                if (!identity) throw new Error("Unauthorized");

                const user = await ctx.db
                        .query("users")
                        .withIndex("by_clerkUserId", q => q.eq("clerkUserId", identity.subject))
                        .unique();

                if (!user) throw new Error("User not found");

                await ctx.db.patch(user._id, { ...args });
                return true;
        }
});
