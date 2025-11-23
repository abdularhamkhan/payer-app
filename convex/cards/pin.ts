import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

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

                const validOld = await bcrypt.compare(oldPin, card.pinHash);
                if (!validOld) throw new Error("Invalid old PIN");

                const newHash = await bcrypt.hash(newPin, 10);

                await ctx.db.patch(card._id, {
                        pinHash: newHash,
                });

                return { success: true };
        },
});
