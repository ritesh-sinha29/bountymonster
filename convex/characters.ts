import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getLevelFromXp } from "../src/lib/xpConfig";
import { insertNotification } from "./notifications";

/**
 * Retrieves the currently authenticated user's character profile.
 */
export const getCurrentCharacter = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier)
      )
      .unique();

    if (!user) return null;

    const character = await ctx.db
      .query("characters")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return character ?? null;
  },
});

/**
 * Updates or creates a user's character. 
 * Synchronizes the user's avatar to ensure consistent display 
 * across sidebars, leaderboards, and comments.
 */
export const changeCharacter = mutation({
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
        q.eq("clerkToken", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("characters")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        characterName: args.characterName,
        theme: args.theme,
      });
    } else {
      await ctx.db.insert("characters", {
        userId: user._id,
        characterName: args.characterName,
        theme: args.theme,
        xp: 0,
        level: 1,
      });
    }

    await ctx.db.patch(user._id, {
      userAvatar: args.userAvatar,
      updatedAT: Date.now(),
    });
  },
});

/**
 * Awards experience points to a user's character and handles level progression.
 * Dispatches a notification if the awarded XP triggers a level up.
 */
export const awardXp = mutation({
  args: {
    amount: v.number(),
    reason: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("clerkToken", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error("User not found");

    const character = await ctx.db
      .query("characters")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!character) throw new Error("Character not found. Please select a character first.");

    const prevXp = character.xp ?? 0;
    const prevLevel = character.level ?? 1;
    const newXp = prevXp + args.amount;
    const newLevel = getLevelFromXp(newXp);

    await ctx.db.patch(character._id, {
      xp: newXp,
      level: newLevel,
    });

    if (newLevel > prevLevel) {
      await insertNotification(ctx, {
        userId: user._id,
        type: "level_up",
        title: `🎉 Level Up! You're now Lv.${newLevel}`,
        body: `You've reached Level ${newLevel}! New challenges and rewards await.`,
      });
    }

    return { newXp, newLevel, leveledUp: newLevel > prevLevel };
  },
});
