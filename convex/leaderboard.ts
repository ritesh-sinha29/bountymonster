import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getXpPerTask } from "../src/lib/xpConfig";

/**
 * Helper to calculate XP for users in a given timeframe.
 */
async function calculateTimeframeXp(ctx: QueryCtx, timeframe: "weekly" | "monthly") {
  const now = Date.now();
  const days = timeframe === "weekly" ? 7 : 30;
  const since = now - days * 24 * 60 * 60 * 1000;

  // Fetch relevant XP sources
  const approvedSubmissions = await ctx.db
    .query("questSubmissions")
    .filter((q) => 
      q.and(
        q.eq(q.field("status"), "approved"),
        q.or(
          q.gte(q.field("resolvedAt"), since),
          q.and(
            q.eq(q.field("resolvedAt"), undefined),
            q.gte(q.field("submittedAt"), since)
          )
        )
      )
    )
    .collect();

  const bonusClaims = await ctx.db
    .query("huntBonusClaims")
    .filter((q) => q.gte(q.field("claimedAt"), since))
    .collect();

  // Aggregate XP per user
  const xpMap = new Map<string, number>();

  // Add XP from submissions
  for (const sub of approvedSubmissions) {
    const userId = sub.userId;
    const bounty = await ctx.db.get(sub.bountyId);
    if (!bounty) continue;
    
    // XP Fallback logic: check task XP, then bounty fallback XP
    const fallbackXp = getXpPerTask(bounty.requirementLevel ?? 1);
    const xp = bounty.tasks?.[sub.taskIndex]?.xp ?? fallbackXp;
    
    xpMap.set(userId, (xpMap.get(userId) ?? 0) + xp);
  }

  // Add XP from bonus claims
  for (const claim of bonusClaims) {
    const userId = claim.userId;
    xpMap.set(userId, (xpMap.get(userId) ?? 0) + claim.xpAwarded);
  }

  return xpMap;
}

/**
 * Retrieves the global leaderboard of characters.
 * Returns the top 100 characters ranked by XP earned in the given timeframe.
 */
export const getLeaderboard = query({
  args: { 
    timeframe: v.optional(v.union(v.literal("weekly"), v.literal("monthly"), v.literal("all-time"))) 
  },
  handler: async (ctx, args) => {
    const timeframe = args.timeframe ?? "all-time";

    if (timeframe === "all-time") {
      const users = await ctx.db
        .query("users")
        .collect()
        .then((rows) =>
          rows
            .filter((u) => (u.xp ?? 0) > 0)
            .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
            .slice(0, 100),
        );

      return await Promise.all(
        users.map(async (user, index) => {
          const char = await ctx.db
            .query("characters")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .first();

          const pbCount = await ctx.db
            .query("bountyParticipants")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect()
            .then((rows) => rows.length);

          return {
            rank: index + 1,
            userId: user._id as string,
            name: user?.name ?? "Hunter",
            avatar: user?.userAvatar ?? null,
            characterName: char?.characterName ?? "Recruit",
            xp: user.xp ?? 0,
            level: user.level ?? 1,
            pbCount,
          };
        }),
      );
    }

    const xpMap = await calculateTimeframeXp(ctx, timeframe);

    // Get sorted users
    const sortedEntries = Array.from(xpMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100);

    return await Promise.all(
      sortedEntries.map(async ([userId, xp], index) => {
        const user = await ctx.db.get(userId as Id<"users">);
        const char = await ctx.db
          .query("characters")
          .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
          .first();

        const pbCount = await ctx.db
          .query("bountyParticipants")
          .withIndex("by_userId", (q) => q.eq("userId", userId as Id<"users">))
          .collect()
          .then((rows) => rows.length);

        return {
          rank: index + 1,
          userId: userId,
          name: user?.name ?? "Hunter",
          avatar: user?.userAvatar ?? null,
          characterName: char?.characterName ?? "Recruit",
          xp: xp,
          level: user?.level ?? 1,
          pbCount,
        };
      })
    );
  },
});

/**
 * Calculates and returns the current authenticated user's rank on the leaderboard for a timeframe.
 */
export const getMyRank = query({
  args: { 
    timeframe: v.optional(v.union(v.literal("weekly"), v.literal("monthly"), v.literal("all-time"))) 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return null;

    const timeframe = args.timeframe ?? "all-time";
    let myXp = 0;
    let rank = 0;

    if (timeframe === "all-time") {
      myXp = user.xp ?? 0;
      const allUsers = await ctx.db.query("users").collect();
      rank = allUsers.filter((u) => (u.xp ?? 0) > myXp).length + 1;
    } else {
      const xpMap = await calculateTimeframeXp(ctx, timeframe);
      myXp = xpMap.get(user._id) ?? 0;
      
      const allXp = Array.from(xpMap.values());
      rank = allXp.filter(xp => xp > myXp).length + 1;
    }

    const myChar = await ctx.db
      .query("characters")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    const pbCount = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect()
      .then((rows) => rows.length);

    return {
      rank,
      name: user.name ?? "Hunter",
      avatar: user.userAvatar ?? null,
      xp: myXp,
      level: user.level ?? 1,
      characterName: myChar?.characterName ?? "Recruit",
      pbCount,
    };
  },
});
