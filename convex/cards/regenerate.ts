import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

function simpleHash(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return Math.abs(hash).toString(36);
}

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
                const newCvcHash = simpleHash(newCvc);

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
