import bcrypt from "bcryptjs";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

// const Provider = v.union(v.literal("VISA"), v.literal("MASTER_CARD"))

export const create = mutation({
        args: {
                // ServiceProvider: Provider,
        },
        handler: async (ctx, ServiceProvider) => {
                const user = await getConvexUser(ctx);
                const userId = user._id;

                //checking if card already exists
                const existing = await ctx.db
                        .query("cards")
                        .withIndex("by_user", (q) => q.eq("userId", userId))
                        .unique();

                if (existing) return existing;


                // Generate Card
                const suffix = Math.floor(Math.random() * 1e12).toString().padStart(12, '0');
                const cardNumber = "4713" + suffix;
                const last4 = cardNumber.slice(-4);

                const cvc = Math.floor(Math.random() * 1e3).toString().padStart(3, '0');
                const pin = Math.floor(Math.random() * 1e4).toString().padStart(4, '0');
                const expiry = "12/29";
                const cvcHash = await bcrypt.hash(cvc, 10);
                const pinHash = await bcrypt.hash(pin, 10);

                // const provider = String(ServiceProvider);

                const cardId = await ctx.db.insert("cards", {
                        userId,
                        provider: "VISA",
                        cardLast4: last4,
                        expiry,
                        cvcHash,
                        pinHash,
                        frozen: false,
                        cardNumber,
                        createdAt: Date.now(),
                });

                return { cardId, last4 }

        }
})