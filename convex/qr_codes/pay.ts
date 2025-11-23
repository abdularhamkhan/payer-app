import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";
import { audit } from "../audit_logs/log";

export const pay = mutation({
  args: {
    token: v.string(),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, { token, amount = null }) => {
    const payer = await getConvexUser(ctx);
    const payerId = payer._id;

    // find qr by token (see note above about indexing)
    // try with index first:
    let qr = null;
    try {
      qr = await ctx.db
        .query("qr_codes")
        .withIndex("by_token", (q) => q.eq("token", token))
        .unique();
    } catch (e) {
      // ignore
    }

    // fallback to scan all (inefficient)
    if (!qr) {
      const all = await ctx.db.query("qr_codes").collect();
      qr = all.find((r) => r.token === token);
    }

    if (!qr) throw new Error("QR code not found");
    if (Date.now() > qr.expiresAt) throw new Error("QR code expired");

    // Determine amount: either QR stored amount or passed amount
    const paymentAmount = amount ?? qr.amount;
    if (!paymentAmount || paymentAmount <= 0) throw new Error("Invalid amount");

    // fetch payer and receiver wallets
    const payerWallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", payerId))
      .unique();
    const receiverWallet = await ctx.db.get(qr.walletId);

    if (!payerWallet || !receiverWallet) throw new Error("Wallet missing");

    if (payerWallet.balance < paymentAmount) throw new Error("Insufficient balance");

    const newPayerBalance = payerWallet.balance - paymentAmount;
    const newReceiverBalance = receiverWallet.balance + paymentAmount;

    await ctx.db.patch(payerWallet._id, { balance: newPayerBalance, updatedAt: Date.now() });
    await ctx.db.patch(receiverWallet._id, { balance: newReceiverBalance, updatedAt: Date.now() });

    // create transactions
    await ctx.db.insert("transactions", {
      userId: payerId,
      walletId: payerWallet._id,
      amount: -paymentAmount,
      type: "DEBIT",
      description: `QR payment to ${qr.userId}`,
      method: "QR_PAY",
      toUserId: qr.userId,
      fromUserId: payerId,
      status: "SUCCESS",
      createdAt: Date.now(),
    });

    await ctx.db.insert("transactions", {
      userId: qr.userId,
      walletId: receiverWallet._id,
      amount: paymentAmount,
      type: "CREDIT",
      description: `QR received from ${payerId}`,
      method: "QR_PAY",
      toUserId: qr.userId,
      fromUserId: payerId,
      status: "SUCCESS",
      createdAt: Date.now(),
    });

    await audit(ctx, payerId, "qr_pay", { qrId: qr._id, amount: paymentAmount });

    // optionally expire single-use qr
    await ctx.db.patch(qr._id, { expiresAt: Date.now() });

    await ctx.db.insert("notifications", {
      userId: qr.userId,
      title: "QR payment received",
      message: `You received ${paymentAmount}`,
      read: false,
      createdAt: Date.now(),
    });

    return { success: true, amount: paymentAmount };
  },
});
