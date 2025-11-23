import { v } from "convex/values";
import { query } from "../_generated/server";
import { normalizePhone } from "../utils/normalizePhone";

export const getByPhone = query({
        args: { phone: v.string() },

        handler: async (ctx, args) => {
                const normalized = normalizePhone(args.phone);

                return await ctx.db
                        .query("users")
                        .withIndex("by_normalizedPhone", q => q.eq("normalizedPhone", normalized))
                        .unique();
        },
});
