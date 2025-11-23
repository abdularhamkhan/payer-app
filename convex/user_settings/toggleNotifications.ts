import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

export const toggleNotifications = mutation({
        handler: async (ctx) => {
                const user = await getConvexUser(ctx);
                const settings = await ctx.db
                        .query("user_settings")
                        .withIndex("by_user", (q) => q.eq("userId", user._id))
                        .unique();

                if (!settings) {
                        const id = await ctx.db.insert("user_settings", {
                                userId: user._id,
                                darkMode: false,
                                language: "en",
                                pushNotifications: false,
                        });
                        await audit(ctx, user._id, "push_toggled", { enabled: false });
                        return { pushNotifications: false, id };
                }

                await ctx.db.patch(settings._id, { pushNotifications: !settings.pushNotifications });
                await audit(ctx, user._id, "push_toggled", { enabled: !settings.pushNotifications });
                return { pushNotifications: !settings.pushNotifications };
        },
});
