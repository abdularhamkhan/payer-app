import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";
import { audit } from "../audit_logs/log";

export const createQR = internalMutation({
  args: {
    amount: v.optional(v.number()),
    expiresAt: v.number(),
    token: v.string(),
  },
  handler: async (ctx, { amount, expiresAt, token }) => {
    const user = await getConvexUser(ctx);
    const uid = user._id;

    // ensure wallet exists
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .unique();

    if (!wallet) throw new Error("Wallet not found");

    const qrId = await ctx.db.insert("qr_codes", {
      userId: uid,
      walletId: wallet._id,
      amount,
      expiresAt,
      token,
      createdAt: Date.now(),
    });

    await audit(ctx, uid, "qr_generated", { qrId, amount });

    return { qrId, token, expiresAt };
  },
});
