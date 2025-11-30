import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const deleteCard = mutation({
	handler: async (ctx) => {
		const user = await getConvexUser(ctx);
		
		// Find user's card
		const card = await ctx.db
			.query("cards")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.first();
		
		if (!card) {
			throw new Error("No card found");
		}
		
		// Delete the card
		await ctx.db.delete(card._id);
		
		// Create notification
		const now = Date.now();
		await ctx.db.insert("notifications", {
			userId: user._id,
			title: "Card Deleted",
			message: `Your virtual card ending in ${card.cardLast4} has been deleted`,
			read: false,
			createdAt: now,
		});
		
		// Create audit log
		await ctx.db.insert("audit_logs", {
			userId: user._id,
			action: "CARD_DELETED",
			payload: { last4: card.cardLast4 },
			createdAt: now,
		});
		
		return { success: true };
	},
});
