import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkToken: v.string(),
    name: v.optional(v.string()), // This will be used as username
    email: v.string(),
    userAvatar: v.optional(v.string()),
    userType: v.union(
      v.literal("user"),
      v.literal("organisation"),
      v.literal("admin"),
      v.literal("default"),
    ),
    planType: v.union(v.literal("free"), v.literal("pro"), v.literal("elite")),
    socialLinks: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          url: v.string(),
        }),
      ),
    ),
    phoneNumber: v.optional(v.string()),
    occupation: v.optional(v.string()),
    onBoarding: v.boolean(),
    streaks: v.optional(v.number()),
    createdAT: v.number(),
    updatedAT: v.number(),
  }).index("by_token", ["clerkToken"]),

  // =====================
  // CHARACTERS
  // =====================
  characters: defineTable({
    userId: v.id("users"),
    characterName: v.string(),
    theme: v.string(),
  }).index("by_userId", ["userId"]),

  bounties: defineTable({
    creatorId: v.id("users"),
    name: v.string(),
    description: v.string(),
    reward: v.number(),
    type: v.string(), // tech, event, etc.
    coverImage: v.string(),
    xpReward: v.number(),
    requirementLevel: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("draft"),
      v.literal("completed"),
    ),
    tasks: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        xp: v.number(),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_creatorId", ["creatorId"]),
});
