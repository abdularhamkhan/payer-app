import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { audit } from "../audit_logs/log";
import { getConvexUser } from "../utils/getUser";

export const expire = mutation({
        args: {
                qrId: v.id("qr_codes"),
        },
        handler: async (ctx, { qrId }) => {
                const user = await getConvexUser(ctx);
                const uid = user._id;
                const qr = await ctx.db.get(qrId);
                if (!qr) throw new Error("QR not found");
                if (qr.userId !== uid) throw new Error("Not authorized");

                await ctx.db.patch(qrId, { expiresAt: Date.now() });

                await audit(ctx, uid, "qr_expired", { qrId });

                return { success: true };
        },
});
