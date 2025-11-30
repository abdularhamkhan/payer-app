import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getConvexUser } from "../utils/getUser";

export const generateUploadUrl = mutation(async (ctx) => {
	return await ctx.storage.generateUploadUrl();
});

export const saveAvatar = mutation({
	args: {
		storageId: v.id("_storage"),
	},
	handler: async (ctx, { storageId }) => {
		const user = await getConvexUser(ctx);
		
		// Get the URL for the stored file
		const avatarUrl = await ctx.storage.getUrl(storageId);
		
		if (!avatarUrl) {
			throw new Error("Failed to get avatar URL");
		}

		// Update user's avatar
		await ctx.db.patch(user._id, {
			avatar: avatarUrl,
		});

		return { avatarUrl };
	},
});
