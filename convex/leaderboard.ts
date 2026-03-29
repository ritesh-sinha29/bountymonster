import { query } from "./_generated/server";

/**
 * Retrieves the global leaderboard of characters.
 * Returns the top 100 characters ranked by their total experience points (XP).
 */
export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const characters = await ctx.db
      .query("characters")
      .withIndex("by_userId") 
      .collect()
      .then((rows) =>
        rows
          .filter((c) => (c.xp ?? 0) > 0) 
          .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
          .slice(0, 100),
      );

    const entries = await Promise.all(
      characters.map(async (char, index) => {
        const user = await ctx.db.get(char.userId);
        return {
          rank: index + 1,
          userId: char.userId,
          name: user?.name ?? "Hunter",
          avatar: user?.userAvatar ?? null,
          characterName: char.characterName,
          xp: char.xp ?? 0,
          level: char.level ?? 1,
          bountiesPlayed: await ctx.db
            .query("bountyParticipants")
            .withIndex("by_userId", (q) => q.eq("userId", char.userId))
            .filter((q) => q.neq(q.field("status"), "left"))
            .collect()
            .then((res) => res.length),
        };
      }),
    );

    return entries;
  },
});

/**
 * Calculates and returns the current authenticated user's rank on the global leaderboard.
 * Rank is determined by the number of characters possessing strictly more XP than the user.
 */
export const getMyRank = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return null;

    const myChar = await ctx.db
      .query("characters")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (!myChar) return null;

    const allChars = await ctx.db.query("characters").collect();
    const myXp = myChar.xp ?? 0;
    const rank = allChars.filter((c) => (c.xp ?? 0) > myXp).length + 1;

    return {
      rank,
      name: user.name ?? "Hunter",
      avatar: user.userAvatar ?? null,
      xp: myXp,
      level: myChar.level ?? 1,
      characterName: myChar.characterName,
    };
  },
});
