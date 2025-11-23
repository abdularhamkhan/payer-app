// import { v } from "convex/values";
// import { query } from "../_generated/server";

// export const scan = query({
//         args: {
//                 token: v.string(),
//         },
//         handler: async (ctx, { token }) => {
//                 // return QR details
//                 const qr = await ctx.db
//                         .query("qr_codes")
//                         .withIndex("by_user", (q) => q.eq("token", token))
//                         .unique();

//                 // token index doesn't exist in schema — if you want direct token lookup,
//                 // add a `token` field and index to schema. Otherwise scan all and filter.
//                 // For now, do a simple filter (less efficient) — recommend adding index.
//                 if (!qr) {
//                         // fallback: full scan (not ideal)
//                         const all = await ctx.db.query("qr_codes").collect();
//                         const found = all.find((r) => (r.token === token));
//                         if (!found) throw new Error("QR not found");
//                         return found;
//                 }
//                 return qr;
//         },
// });
