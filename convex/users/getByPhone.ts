import { v } from "convex/values";
import { query } from "../_generated/server";
import { normalizePhone } from "../utils/normalizePhone";

export const getByPhone = query({
        args: { phone: v.string() },
        handler: async (ctx, { phone }) => {
                const normalized = normalizePhone(phone);
                const user = await ctx.db
                        .query("users")
                        .withIndex("by_normalizedPhone", q => q.eq("normalizedPhone", normalized))
                        .first(); // Use first() instead of unique() to avoid duplicate errors
        return user;
    },
});
