import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==================================
// NEW USER
// ==================================
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
      return user?._id;
    }

    return await ctx.db.insert("users", {
      name: identity?.name || "",
      clerkToken: identity?.tokenIdentifier!,
      email: identity?.email!,
      userType: "default",
      planType: "free",
      onBoarding: false,
      createdAT: Date.now(),
      updatedAT: Date.now(),
    });
  },
});
// ==============================
// GET CURRENT USER
// ===============================
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

// ==============================
// UPDATE ONBOARDING STEP 1
// ===============================
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

// ==============================
// UPDATE ONBOARDING STEP 2
// ===============================
export const updateOnboardingStep2 = mutation({
  args: {
    name: v.string(), // username field as requested
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

// ==============================
// COMPLETE ONBOARDING
// ===============================
export const completeOnboarding = mutation({
  args: {
    characterName: v.string(),
    theme: v.string(),
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

    // Save character info
    await ctx.db.insert("characters", {
      userId: user._id,
      characterName: args.characterName,
      theme: args.theme,
    });

    // Complete onboarding
    await ctx.db.patch(user._id, {
      onBoarding: true,
      updatedAT: Date.now(),
    });
  },
});
