import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const freeze = mutation({
        args: {},
        handler: async (ctx) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                const card = await ctx.db
                        .query("cards")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (!card) throw new Error("Card not found");

                await ctx.db.patch(card._id, { frozen: true });

                return { success: true };
        },
});
