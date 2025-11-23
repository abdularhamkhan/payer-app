import bcrypt from "bcryptjs";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const regenerate = mutation({
        args: {},
        handler: async (ctx) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                const card = await ctx.db
                        .query("cards")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (!card) throw new Error("Card not found");

                const suffix = Math.floor(Math.random() * 1e12).toString().padStart(12, '0');
                const newCardNumber = "5913" + suffix;
                const last4 = newCardNumber.slice(-4);
                const newExpiry = "01/30";

                const newCvc = "456";
                const newCvcHash = await bcrypt.hash(newCvc, 10);

                await ctx.db.patch(card._id, {
                        provider: "MASTER CARD",
                        cardLast4: last4,
                        expiry: newExpiry,
                        cvcHash: newCvcHash,
                        cardNumber: newCardNumber,
                        // PIN stays same
                });

                return { last4, expiry: newExpiry };
        },
});
