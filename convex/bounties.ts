import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBounty = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    reward: v.number(),
    type: v.string(),
    coverImage: v.string(),
    xpReward: v.number(),
    requirementLevel: v.number(),
    tasks: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        xp: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const bountyId = await ctx.db.insert("bounties", {
      ...args,
      creatorId: user._id,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return bountyId;
  },
});

export const getBounties = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bounties").order("desc").collect();
  },
});

export const getBounty = query({
  args: { id: v.id("bounties") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
