import { query } from "../_generated/server";

export const me = query({
        handler: async (ctx) => {
                const identity = await ctx.auth.getUserIdentity();
                if (!identity) return null;

                const user = await ctx.db
                        .query("users")
                        .withIndex("by_clerkUserId", q => q.eq("clerkUserId", identity.subject))
                        .unique();

                if (!user) return null;

                const settings = await ctx.db
                        .query("user_settings")
                        .withIndex("by_user", q => q.eq("userId", user._id))
                        .unique();

                return { ...user, settings };
        }
});
