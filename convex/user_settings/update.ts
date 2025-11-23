import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

export const update = mutation({
        args: {
                darkMode: v.optional(v.boolean()),
                language: v.optional(v.string()),
                pushNotifications: v.optional(v.boolean()),
        },
        handler: async (ctx, args) => {
                const user = await getConvexUser(ctx);
                const settings = await ctx.db
                        .query("user_settings")
                        .withIndex("by_user", (q) => q.eq("userId", user._id))
                        .unique();

                if (!settings) {
                        // create default then patch
                        const id = await ctx.db.insert("user_settings", {
                                userId: user._id,
                                darkMode: args.darkMode ?? false,
                                language: args.language ?? "en",
                                pushNotifications: args.pushNotifications ?? true,
                        });
                        await audit(ctx, user._id, "settings_created", { id });
                        return { id };
                }

                await ctx.db.patch(settings._id, { ...args });
                await audit(ctx, user._id, "settings_updated", args);
                return { success: true };
        },
});
