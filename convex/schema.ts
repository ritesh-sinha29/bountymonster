import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  users: defineTable({
    clerkToken: v.string(),
    name: v.optional(v.string()), // Used as the primary username
    email: v.string(),
    userAvatar: v.optional(v.string()),
    userType: v.union(
      v.literal("user"),
      v.literal("admin"),
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
    onBoarding: v.boolean(),
    streaks: v.optional(v.number()),
    mainMoto: v.optional(v.string()),
    createdAT: v.number(),
    updatedAT: v.number(),
  }).index("by_token", ["clerkToken"]),

  // --------------------------------------------------
  characters: defineTable({
    userId: v.id("users"),
    characterName: v.string(),
    characterAvatar: v.optional(v.string()),
    theme: v.string(),
    xp: v.optional(v.number()),
    level: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  // -----------------------------------------------------
  bounties: defineTable({
    creatorId: v.id("users"),
    name: v.string(),
    description: v.string(),
    reward: v.number(),
    maxHunters: v.optional(v.number()),
    rewardPerHunter: v.optional(v.number()),
    type: v.string(), // Extensible typing system (e.g. tech, event)
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
        url: v.optional(v.string()),
        xp: v.number(),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    editedAt: v.optional(v.number()),
  }).index("by_creatorId", ["creatorId"]),

  bountyParticipants: defineTable({
    bountyId: v.id("bounties"),
    userId: v.id("users"),
    joinedAt: v.number(),
    status: v.union(
      v.literal("active"),   
      v.literal("left"),     
      v.literal("submitted"),
    ),
    leftAt: v.optional(v.number()),
  })
    .index("by_bountyId", ["bountyId"])
    .index("by_userId", ["userId"])
    .index("by_bountyId_userId", ["bountyId", "userId"]),

  questSubmissions: defineTable({
    bountyId: v.id("bounties"),
    userId: v.id("users"),
    taskIndex: v.number(),       
    proofUrls: v.array(v.string()), 
    note: v.optional(v.string()),
    submittedAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
  })
    .index("by_bountyId", ["bountyId"])
    .index("by_userId", ["userId"])
    .index("by_bountyId_userId", ["bountyId", "userId"])
    .index("by_bountyId_userId_taskIndex", ["bountyId", "userId", "taskIndex"]),

  notifications: defineTable({
    userId: v.id("users"),          
    type: v.string(),              
    title: v.string(),
    body: v.string(),
    link: v.optional(v.string()),  
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  dailyLogins: defineTable({
    userId: v.id("users"),
    dateString: v.string(), // e.g., "2026-03-29"
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "dateString"]),

  huntBonusClaims: defineTable({
    userId: v.id("users"),
    milestoneKey: v.string(), 
    xpAwarded: v.number(),
    claimedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_milestone", ["userId", "milestoneKey"]),
    
// -----------------------------------------------------------

  searchHistory: defineTable({
    userId: v.id("users"),
    query: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
