import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

export const toggleDarkMode = mutation({
        handler: async (ctx) => {
                const user = await getConvexUser(ctx);
                const settings = await ctx.db
                        .query("user_settings")
                        .withIndex("by_user", (q) => q.eq("userId", user._id))
                        .unique();

                if (!settings) {
                        const id = await ctx.db.insert("user_settings", {
                                userId: user._id,
                                darkMode: true,
                                language: "en",
                                pushNotifications: true,
                        });
                        await audit(ctx, user._id, "dark_mode_toggled", { enabled: true });
                        return { darkMode: true, id };
                }

                await ctx.db.patch(settings._id, { darkMode: !settings.darkMode });
                await audit(ctx, user._id, "dark_mode_toggled", { enabled: !settings.darkMode });
                return { darkMode: !settings.darkMode };
        },
});
