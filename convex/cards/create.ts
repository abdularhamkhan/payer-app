import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

// Simple hash function for demo purposes (use proper hashing in production)
function simpleHash(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return Math.abs(hash).toString(36);
}

export const create = mutation({
        args: {},
        handler: async (ctx) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                //checking if card already exists
                const existing = await ctx.db
                        .query("cards")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (existing) return existing;


                // Generate Card - Randomly choose between VISA (4xxx) and Mastercard (5xxx)
                const providers = ["VISA", "Mastercard"];
                const selectedProvider = providers[Math.floor(Math.random() * providers.length)];
                const prefix = selectedProvider === "VISA" ? "4713" : "5412";
                const suffix = Math.floor(Math.random() * 1e12).toString().padStart(12, '0');
                const cardNumber = prefix + suffix;
                const last4 = cardNumber.slice(-4);

                const cvc = Math.floor(Math.random() * 1e3).toString().padStart(3, '0');
                const pin = Math.floor(Math.random() * 1e4).toString().padStart(4, '0');
                const expiry = "12/29";
                const cvcHash = simpleHash(cvc);
		const pinHash = simpleHash(pin);
		const now = Date.now();

		// const provider = String(ServiceProvider);

		const cardId = await ctx.db.insert("cards", {
			userId,
			provider: selectedProvider,
			cardLast4: last4,
			expiry,
			cvcHash,
			pinHash,
			frozen: false,
			cardNumber,
			createdAt: now,
		});

		// Create notification
		await ctx.db.insert("notifications", {
			userId,
			title: "Card Created",
			message: `Your virtual card ending in ${last4} has been created successfully`,
			read: false,
			createdAt: now,
		});

		// Create audit log
		await ctx.db.insert("audit_logs", {
			userId,
			action: "CARD_CREATED",
			payload: { last4 },
			createdAt: now,
		});

		return { cardId, last4 }

        }
})