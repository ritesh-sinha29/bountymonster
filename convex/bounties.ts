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
    deadline: v.number(),
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
              body: `"${args.name}" — ${args.reward} credits reward is live.`,
              link: `/home/bounty/${bountyId}`,
            }),
          ),
      );
    }

    return bountyId;
  },
});

/**
 * Helper to fetch the current user's document based on Clerk authentication.
 */
const getCurrentUser = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q: { eq: (arg0: string, arg1: any) => any; }) => q.eq("clerkToken", identity.tokenIdentifier))
    .unique();
};

/**
 * Centralized helper to enrich a raw bounty document with user-specific status flags
 * and engagement metrics. Exported to be reused by participation queries.
 */
export async function enrichBountyDoc(ctx: any, bounty: any, user: any) {
  const creator = await ctx.db.get(bounty.creatorId);
  const participants = await ctx.db
    .query("bountyParticipants")
    .withIndex("by_bountyId", (q: any) => q.eq("bountyId", bounty._id))
    .filter((q: any) => 
      q.or(
        q.eq(q.field("status"), "active"),
        q.eq(q.field("status"), "submitted"),
        q.eq(q.field("status"), "completed")
      )
    )
    .collect();

  let isJoined = false;
  let isCompleted = false;
  let userStatus: string | null = null;

  if (user) {
    const participation = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_bountyId_userId", (q: any) => 
        q.eq("bountyId", bounty._id).eq("userId", user._id)
      )
      .first();
    
    if (participation) {
      userStatus = participation.status;
      isJoined = userStatus === "active" || userStatus === "submitted" || userStatus === "completed";
      isCompleted = userStatus === "completed";

      // Dynamically verify completion if DB status is stale
      if (!isCompleted && (userStatus === "active" || userStatus === "submitted")) {
        const userSubmissions = await ctx.db
          .query("questSubmissions")
          .withIndex("by_bountyId_userId", (q: any) => 
            q.eq("bountyId", bounty._id).eq("userId", user._id)
          )
          .collect();
        const resolvedIndices = new Set(
          userSubmissions
            .filter((s: any) => s.status === "approved" || s.status === "rejected")
            .map((s: any) => s.taskIndex)
        );
        if (bounty.tasks && bounty.tasks.length > 0) {
          isCompleted = bounty.tasks.every((_: any, i: number) => resolvedIndices.has(i));
        }
      }
    }
  }

  return {
    ...bounty,
    participantCount: participants.length,
    isJoined,
    isCompleted,
    userStatus,
    isCreator: user ? bounty.creatorId === user._id : false,
    creatorName: creator?.name || "Anonymous",
    isBoosted: bounty.isBoosted && (bounty.boostStartedAt ?? 0) <= Date.now() && (bounty.boostEndsAt ?? 0) > Date.now(),
    boostEndsAt: bounty.boostEndsAt,
  };
}

/**
 * Retrieves a limited list of the most recent bounties with user-specific status.
 */
export const getBounties = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const limit = Math.min(args.limit ?? 50, 100);
    const bounties = await ctx.db.query("bounties").order("desc").take(limit);

    return await Promise.all(
      bounties.map((b) => enrichBountyDoc(ctx, b, user))
    );
  },
});

/**
 * Retrieves a paginated list of bounties for infinite scrolling.
 * Includes user-specific relation flags.
 */
export const getBountiesPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const paginated = await ctx.db
      .query("bounties")
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...paginated,
      page: await Promise.all(
        paginated.page.map((b) => enrichBountyDoc(ctx, b, user))
      ),
    };
  },
});

/**
 * Fetches detail for a specific bounty including user-specific status.
 */
export const getBounty = query({
  args: { id: v.id("bounties") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const bounty = await ctx.db.get(args.id);
    if (!bounty) return null;

    return await enrichBountyDoc(ctx, bounty, user);
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
    deadline: v.number(),
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
    const user = await getCurrentUser(ctx);
    const recent = await ctx.db.query("bounties").order("desc").take(50);
    const enriched = await Promise.all(
      recent.map((b) => enrichBountyDoc(ctx, b, user))
    );
    return enriched.sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0)).slice(0, 5);
  },
});

/**
 * Retrieves currently boosted bounties.
 */
export const getBoostedBounties = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const boosted = await ctx.db
      .query("bounties")
      .filter((q) => 
        q.and(
          q.eq(q.field("isBoosted"), true),
          q.lte(q.field("boostStartedAt"), Date.now()),
          q.gt(q.field("boostEndsAt"), Date.now())
        )
      )
      .collect();

    return await Promise.all(
      boosted.map((b) => enrichBountyDoc(ctx, b, user))
    );
  },
});

/**
 * Activates boost on a bounty after successful payment verification.
 * Called from the client after the existing /api/payments/razorpay/verify route confirms the signature.
 */
export const activateBountyBoost = mutation({
  args: {
    bountyId: v.id("bounties"),
    days: v.number(),
    startDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    if (bounty.creatorId !== user._id) throw new Error("Not the creator");

    const boostEndsAt = args.startDate + args.days * 24 * 60 * 60 * 1000;

    await ctx.db.patch(args.bountyId, {
      isBoosted: true,
      boostStartedAt: args.startDate,
      boostEndsAt,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
