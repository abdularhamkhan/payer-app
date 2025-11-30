import { v } from "convex/values";
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

export const updatePin = mutation({
        args: {
                oldPin: v.string(),
                newPin: v.string(),
        },
        handler: async (ctx, { oldPin, newPin }) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                const card = await ctx.db
                        .query("cards")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (!card) throw new Error("Card not found");

                const validOld = simpleHash(oldPin) === card.pinHash;
                if (!validOld) throw new Error("Invalid old PIN");

                const newHash = simpleHash(newPin);

                await ctx.db.patch(card._id, {
                        pinHash: newHash,
                });

                return { success: true };
        },
});
