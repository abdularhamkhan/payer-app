import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";
import { audit } from "../audit_logs/log";
import { randomBytes } from "crypto";

export const generate = mutation({
  args: {
    amount: v.optional(v.number()),
    ttlSeconds: v.optional(v.number()), // lifetime in seconds
  },
  handler: async (ctx, { amount, ttlSeconds = 300 }) => {
    const user = await getConvexUser(ctx);
    const uid = user._id;

    // ensure wallet exists
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .unique();

    if (!wallet) throw new Error("Wallet not found");

    // Create a friendly code (could be UUID or base64)
    // For simplicity: random hex string
    const token = randomBytes(8).toString("hex");

    const expiresAt = Date.now() + ttlSeconds * 1000;

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
