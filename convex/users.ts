import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const createNewUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized sorry !");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();

    if (user) {
      return user._id;
    }

    return await ctx.db.insert("users", {
      name: identity.name || "",
      clerkToken: identity.tokenIdentifier,
      userAvatar: identity.pictureUrl || "",
      email: identity.email || "",
      userType: "user",
      planType: "free",
      onBoarding: false,
      xp: 0,
      level: 1,
      createdAT: Date.now(),
      updatedAT: Date.now(),
    });
  },
});

/**
 * Retrieves the currently authenticated user's details.
 * Returns null if the user is unauthenticated or not found.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();

    return user ?? null;
  },
});


export const updateOnboardingStep1 = mutation({
  args: {
    mainMoto: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      mainMoto: args.mainMoto,
      updatedAT: Date.now(),
    });
  },
});


export const updateOnboardingStep2 = mutation({
  args: {
    name: v.string(), 
    phoneNumber: v.string(),
    socialLinks: v.optional(
      v.array(v.object({ platform: v.string(), url: v.string() })),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      name: args.name,
      phoneNumber: args.phoneNumber,
      socialLinks: args.socialLinks,
      updatedAT: Date.now(),
    });
  },
});


export const completeOnboarding = mutation({
  args: {
    characterName: v.string(),
    theme: v.string(),
    characterAvatar: v.string(), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.insert("characters", {
      userId: user._id,
      characterName: args.characterName,
      characterAvatar: args.characterAvatar,
      theme: args.theme,
    });

    await ctx.db.patch(user._id, {
      onBoarding: true,
      updatedAT: Date.now(),
    });
  },
});

/**
 * Modifies the user's avatar.
 * Intended for use when updating the core character post-onboarding.
 */
export const updateCharacterAvatar = mutation({
  args: {
    userAvatar: v.string(), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      userAvatar: args.userAvatar,
      updatedAT: Date.now(),
    });
  },
});

/**
 * Logs a daily login for a user to track streaks.
 */
export const logDailyLogin = mutation({
  args: {
    timezoneOffset: v.number(), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();
    if (!user) return;

    const now = Date.now();
    const userNow = new Date(now - args.timezoneOffset * 60000);
    const dateString = userNow.toISOString().split("T")[0];

    const existing = await ctx.db
      .query("dailyLogins")
      .withIndex("by_userId_date", (q) => q.eq("userId", user._id).eq("dateString", dateString))
      .first();

    if (existing) return;

    const yesterday = new Date(now - args.timezoneOffset * 60000 - 86400000);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    const yesterdayLogin = await ctx.db
      .query("dailyLogins")
      .withIndex("by_userId_date", (q) => q.eq("userId", user._id).eq("dateString", yesterdayString))
      .first();

    let currentStreak = user.streaks || 0;

    if (yesterdayLogin) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    await ctx.db.patch(user._id, { streaks: currentStreak });
    await ctx.db.insert("dailyLogins", {
      userId: user._id,
      dateString,
      timestamp: now,
    });
  },
});

/**
 * Fetches the user's daily login history.
 */
export const getMyDailyLogins = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("dailyLogins")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});
