import { MutationCtx, QueryCtx } from "../_generated/server";

export async function getConvexUser(ctx: QueryCtx | MutationCtx) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const clerkId = identity.subject;

        const user = await ctx.db
                .query("users")
                .withIndex("by_clerkUserId", q => q.eq("clerkUserId", clerkId))
                .unique();

        if (!user) throw new Error("User not found in database");

        return user; // includes _id (Convex ID)
}
