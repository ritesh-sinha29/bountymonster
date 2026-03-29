import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a new user record in the database if one does not already exist.
 * Integrates with Clerk authentication.
 */
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
      email: identity.email || "",
      userType: "default",
      planType: "free",
      onBoarding: false,
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

/**
 * Updates the user's account type during the first step of onboarding.
 */
export const updateOnboardingStep1 = mutation({
  args: {
    userType: v.union(v.literal("user"), v.literal("organisation")),
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
      userType: args.userType,
      updatedAT: Date.now(),
    });
  },
});

/**
 * Updates the user's account details during the second step of onboarding.
 * Captures name, contact information, occupation, and social links.
 */
export const updateOnboardingStep2 = mutation({
  args: {
    name: v.string(), 
    phoneNumber: v.string(),
    occupation: v.string(),
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
      occupation: args.occupation,
      socialLinks: args.socialLinks,
      updatedAT: Date.now(),
    });
  },
});

/**
 * Finalizes the onboarding process for the user.
 * Creates their base character profile and marks the onboarding step as complete.
 */
export const completeOnboarding = mutation({
  args: {
    characterName: v.string(),
    theme: v.string(),
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

    await ctx.db.insert("characters", {
      userId: user._id,
      characterName: args.characterName,
      theme: args.theme,
      xp: 0,
      level: 1,
    });

    await ctx.db.patch(user._id, {
      onBoarding: true,
      userAvatar: args.userAvatar,
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
