import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { insertNotification } from "./notifications";

const HIGH_REWARD_THRESHOLD = 200;

/**
 * Creates a new bounty and notifies users if the reward is exceptionally high.
 * Ensures the action is performed by an authenticated user.
 */
export const createBounty = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    reward: v.number(),
    maxHunters: v.optional(v.number()),
    rewardPerHunter: v.optional(v.number()),
    currency: v.optional(v.string()),
    type: v.string(),
    coverImage: v.string(),
    xpReward: v.number(),
    requirementLevel: v.number(),
    tasks: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        url: v.optional(v.string()),
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

    // Notify all users if reward meets or exceeds the high-value threshold
    if (args.reward >= HIGH_REWARD_THRESHOLD) {
      const allUsers = await ctx.db.query("users").collect();
      await Promise.all(
        allUsers
          .filter((u) => u._id !== user._id)
          .map((u) =>
            insertNotification(ctx, {
              userId: u._id,
              type: "bounty_new",
              title: "🔥 High-value bounty posted!",
              body: `"${args.name}" — ${args.reward} ${args.currency ?? "coins"} reward is live.`,
              link: `/home/bounty/${bountyId}`,
            }),
          ),
      );
    }

    return bountyId;
  },
});

/**
 * Retrieves a limited list of the most recent bounties.
 * Useful for initial loads or non-paginated lists.
 */
export const getBounties = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 50, 100);
    return await ctx.db.query("bounties").order("desc").take(limit);
  },
});

/**
 * Retrieves a paginated list of bounties for infinite scrolling.
 * Employs Convex's built-in pagination mechanics.
 */
export const getBountiesPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bounties")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/**
 * Fetches the complete details for a specific bounty by its ID.
 */
export const getBounty = query({
  args: { id: v.id("bounties") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Updates an exisiting bounty. 
 * Enforces business rules: the user must be the original creator,
 * edits are only permitted within 24 hours of creation, and only one edit is allowed.
 */
export const updateBounty = mutation({
  args: {
    id: v.id("bounties"),
    name: v.string(),
    description: v.string(),
    reward: v.number(),
    maxHunters: v.optional(v.number()),
    rewardPerHunter: v.optional(v.number()),
    currency: v.optional(v.string()),
    type: v.string(),
    coverImage: v.string(),
    xpReward: v.number(),
    requirementLevel: v.number(),
    tasks: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        url: v.optional(v.string()),
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

    const { id, ...updateData } = args;

    const existingBounty = await ctx.db.get(id);

    if (!existingBounty) {
      throw new Error("Bounty not found");
    }

    if (existingBounty.creatorId !== user._id) {
      throw new Error("Unauthorized to edit this bounty");
    }

    // Rule 1: Allow editing only within the first 24 hours
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (Date.now() - existingBounty.createdAt > TWENTY_FOUR_HOURS) {
      throw new Error("Edit window expired. Bounties can only be edited within 24 hours of creation.");
    }

    // Rule 2: Limit to a single post-creation edit
    if (existingBounty.editedAt) {
      throw new Error("This bounty has already been edited. Each bounty can only be edited once.");
    }

    await ctx.db.patch(id, {
      ...updateData,
      editedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * Retrieves trending bounties based on highest XP reward among recent entries.
 */
export const getTrendingBounties = query({
  args: {},
  handler: async (ctx) => {
    const recent = await ctx.db.query("bounties").order("desc").take(50);
    return recent.sort((a, b) => b.xpReward - a.xpReward).slice(0, 5);
  },
});
