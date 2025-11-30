'use node';
import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { randomBytes } from "crypto";

export const generate = action({
  args: {
    amount: v.optional(v.number()),
    ttlSeconds: v.optional(v.number()), // lifetime in seconds
  },
  handler: async (ctx, { amount, ttlSeconds = 300 }): Promise<{ qrId: any; token: string; expiresAt: number }> => {
    // Create a friendly code (could be UUID or base64)
    // For simplicity: random hex string
    const token: string = randomBytes(8).toString("hex");
    const expiresAt: number = Date.now() + ttlSeconds * 1000;

    // Call mutation to insert into DB
    const result: { qrId: any; token: string; expiresAt: number } = await ctx.runMutation(internal.qr_codes.generateInternal.createQR, {
      amount,
      expiresAt,
      token,
    });

    return result;
  },
});
