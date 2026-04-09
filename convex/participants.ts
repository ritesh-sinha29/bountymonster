import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { insertNotification } from "./notifications";
import { getXpPerTask, getLevelFromXp } from "../src/lib/xpConfig";
import { enrichBountyDoc } from "./bounties";

/**
 * Retrieves the currently authenticated user from the local database.
 * Matches them via their clerk token. Returns the user or throws an authorization error.
 */
async function getAuthedUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) =>
      q.eq("clerkToken", identity.tokenIdentifier),
    )
    .unique();
  if (!user) throw new Error("User not found");
  return user;
}

/**
 * Enrolls a user into an active bounty.
 * Validates the bounty state and remaining capacity before allowing the join operation.
 * Users cannot join a bounty they created.
 */
export const joinBounty = mutation({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);

    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    if (bounty.status !== "active") throw new Error("Bounty is not active");
    if (Date.now() > bounty.deadline) throw new Error("Bounty deadline has passed");
    if (bounty.creatorId === user._id)
      throw new Error("You cannot join your own bounty");
    
    if ((user.level ?? 1) < (bounty.requirementLevel ?? 1))
      throw new Error(`Level ${bounty.requirementLevel} required to join this bounty`);

    const existing = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_bountyId_userId", (q: any) =>
        q.eq("bountyId", args.bountyId).eq("userId", user._id),
      )
      .first();

    if (existing) {
      if (existing.status === "active") throw new Error("Already joined");
      await ctx.db.patch(existing._id, {
        status: "active",
        joinedAt: Date.now(),
        leftAt: undefined,
      });
      return existing._id;
    }

    if (bounty.maxHunters !== undefined) {
      const activeRows = await ctx.db
        .query("bountyParticipants")
        .withIndex("by_bountyId", (q: any) => q.eq("bountyId", args.bountyId))
        .filter((q: any) => q.eq(q.field("status"), "active"))
        .take(bounty.maxHunters + 1); 

      if (activeRows.length >= bounty.maxHunters)
        throw new Error("Bounty is full. Max hunters reached.");
    }

    const id = await ctx.db.insert("bountyParticipants", {
      bountyId: args.bountyId,
      userId: user._id,
      joinedAt: Date.now(),
      status: "active",
    });

    await insertNotification(ctx, {
      userId: user._id,
      type: "bounty_joined",
      title: "⚔️ You joined a bounty!",
      body: `You've joined "${bounty.name}". Good luck, hunter!`,
      link: `/home/bounty/${args.bountyId}`,
    });

    return id;
  },
});

/**
 * Allows a user to formally leave or unenroll from a bounty they previously joined.
 */
export const leaveBounty = mutation({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);

    const participation = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_bountyId_userId", (q: any) =>
        q.eq("bountyId", args.bountyId).eq("userId", user._id),
      )
      .first();

    if (!participation || participation.status !== "active")
      throw new Error("You are not participating in this bounty");

    await ctx.db.patch(participation._id, {
      status: "left",
      leftAt: Date.now(),
    });
  },
});

/**
 * Evaluates whether the currently authenticated user is actively participating 
 * in a specific bounty.
 */
export const getMyParticipation = query({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return null;

    return await ctx.db
      .query("bountyParticipants")
      .withIndex("by_bountyId_userId", (q: any) =>
        q.eq("bountyId", args.bountyId).eq("userId", user._id),
      )
      .first();
  },
});

/**
 * Returns the total count of active participants for a given bounty.
 * Optimized using an index-based filter before evaluation.
 */
export const getParticipantCount = query({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_bountyId", (q: any) => q.eq("bountyId", args.bountyId))
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .take(10001); 
    return rows.length;
  },
});

/**
 * Aggregates a list of all bounties the authenticated user is actively engaged in.
 */
export const getMyJoinedBounties = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return [];

    const participations = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => 
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), "completed")
        )
      )
      .take(200);

    const bounties = await Promise.all(
      participations.map(async (p: any) => {
        const doc = await ctx.db.get(p.bountyId);
        if (!doc) return null;
        return await enrichBountyDoc(ctx, doc, user);
      }),
    );

    return bounties.filter(Boolean);
  },
});

/**
 * Commits a quest submission against a specific bounty task.
 * Submissions undergo validation to ensure they contain necessary proofs and handle duplicates smoothly.
 */
export const submitQuest = mutation({
  args: {
    bountyId: v.id("bounties"),
    taskIndex: v.number(),
    proofUrls: v.array(v.string()), 
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);

    const participation = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_bountyId_userId", (q: any) =>
        q.eq("bountyId", args.bountyId).eq("userId", user._id),
      )
      .first();

    if (!participation || participation.status !== "active")
      throw new Error("You must join the bounty before submitting quests");

    if (!args.proofUrls || args.proofUrls.length === 0)
      throw new Error("Proof is required to submit a quest");

    const existing = await ctx.db
      .query("questSubmissions")
      .withIndex("by_bountyId_userId_taskIndex", (q: any) =>
        q
          .eq("bountyId", args.bountyId)
          .eq("userId", user._id)
          .eq("taskIndex", args.taskIndex),
      )
      .first();

    if (existing) {
      if (existing.status === "pending" || existing.status === "approved")
        throw new Error("You have already submitted this quest");
      await ctx.db.patch(existing._id, {
        proofUrls: args.proofUrls,
        note: args.note,
        submittedAt: Date.now(),
        status: "pending",
      });
      return existing._id;
    }

    const id = await ctx.db.insert("questSubmissions", {
      bountyId: args.bountyId,
      userId: user._id,
      taskIndex: args.taskIndex,
      proofUrls: args.proofUrls,
      note: args.note,
      submittedAt: Date.now(),
      status: "pending",
    });

    const bounty = await ctx.db.get(args.bountyId);
    const taskName = bounty?.tasks?.[args.taskIndex]?.name ?? `Task ${args.taskIndex + 1}`;
    await insertNotification(ctx, {
      userId: user._id,
      type: "quest_submitted",
      title: "📋 Quest submitted!",
      body: `Your proof for "${taskName}" is under review.`,
      link: `/home/bounty/${args.bountyId}`,
    });

    return id;
  },
});

/**
 * Extracts a list of current submissions provided by the user for a single bounty context.
 */
export const getMySubmissions = query({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("questSubmissions")
      .withIndex("by_bountyId_userId", (q: any) =>
        q.eq("bountyId", args.bountyId).eq("userId", user._id),
      )
      .collect();
  },
});

/**
 * Transitions a submission state to 'approved', triggering the distribution of experience points.
 * Triggers distinct user updates and handles potential level promotions concurrently.
 */
export const approveSubmission = mutation({
  args: { submissionId: v.id("questSubmissions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");
    if (submission.status === "approved") throw new Error("Already approved");

    const bounty = await ctx.db.get(submission.bountyId);
    if (!bounty) throw new Error("Bounty not found");
    
    // Authorization check: only creator can approve
    const authedUser = await getAuthedUser(ctx);
    if (bounty.creatorId !== authedUser._id) {
      throw new Error("Only the bounty creator can approve submissions.");
    }

    const xpAmount = getXpPerTask(bounty.requirementLevel ?? 1);

    await ctx.db.patch(args.submissionId, { 
      status: "approved",
      resolvedAt: Date.now(),
    });

    const user = await ctx.db.get(submission.userId);
    if (!user) throw new Error("User not found");

    const taskXp = bounty.tasks?.[submission.taskIndex]?.xp ?? xpAmount;
    const prevXp = user.xp ?? 0;
    const prevLevel = user.level ?? 1;
    const newXp = prevXp + taskXp;
    const newLevel = getLevelFromXp(newXp);

    await ctx.db.patch(user._id, { xp: newXp, level: newLevel });

    await insertNotification(ctx, {
      userId: submission.userId,
      type: "quest_approved",
      title: `✅ Quest approved! +${taskXp} XP`,
      body: `Your submission for "${bounty.tasks?.[submission.taskIndex]?.name ?? `Task ${submission.taskIndex + 1}`}" was approved.`,
      link: `/home/bounty/${submission.bountyId}`,
    });

    if (newLevel > prevLevel) {
      await insertNotification(ctx, {
        userId: submission.userId,
        type: "level_up",
        title: `🎉 Level Up! You're now Lv.${newLevel}`,
        body: `You've reached Level ${newLevel}! New challenges and XP await.`,
      });
    }

    // Check for Bounty Completion (Individual and Global)
    await checkAndMarkBountyCompleted(ctx, submission.bountyId, submission.userId);
  },
});

/**
 * Marks a submission as rejected.
 * Also checks if the bounty should be marked as completed.
 */
export const rejectSubmission = mutation({
  args: { submissionId: v.id("questSubmissions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");
    if (submission.status !== "pending") throw new Error("Only pending submissions can be rejected");

    const bounty = await ctx.db.get(submission.bountyId);
    if (!bounty) throw new Error("Bounty not found");

    // Authorization check
    const authedUser = await getAuthedUser(ctx);
    if (bounty.creatorId !== authedUser._id) {
      throw new Error("Only the bounty creator can reject submissions.");
    }

    await ctx.db.patch(args.submissionId, { 
      status: "rejected",
      resolvedAt: Date.now(),
    });

    await insertNotification(ctx, {
      userId: submission.userId,
      type: "quest_rejected",
      title: "❌ Quest rejected",
      body: `Your submission for "${bounty.tasks?.[submission.taskIndex]?.name ?? `Task ${submission.taskIndex + 1}`}" was rejected.`,
      link: `/home/bounty/${submission.bountyId}`,
    });

    // Check for Bounty Completion (Individual and Global)
    await checkAndMarkBountyCompleted(ctx, submission.bountyId, submission.userId);
  },
});

/**
 * Helper to check if a bounty is finished for a specific user and globally.
 */
async function checkAndMarkBountyCompleted(ctx: any, bountyId: Id<"bounties">, userId?: Id<"users">) {
  const bounty = await ctx.db.get(bountyId);
  if (!bounty) return;

  const tasks = bounty.tasks ?? [];
  if (tasks.length === 0) return;

  // 1. Individual Hunter Completion Check
  if (userId) {
    const userSubmissions = await ctx.db
      .query("questSubmissions")
      .withIndex("by_bountyId_userId", (q: any) => q.eq("bountyId", bountyId).eq("userId", userId))
      .collect();

    const resolvedIndices = new Set(
      userSubmissions
        .filter((s: any) => s.status === "approved" || s.status === "rejected")
        .map((s: any) => s.taskIndex)
    );

    // Explicitly verify every task defined in the bounty document is resolved
    const allTasksDone = tasks.every((_: any, i: number) => resolvedIndices.has(i));

    if (allTasksDone) {
      const participation = await ctx.db
        .query("bountyParticipants")
        .withIndex("by_bountyId_userId", (q: any) => q.eq("bountyId", bountyId).eq("userId", userId))
        .first();
      
      // We check for any non-terminal state (!== 'completed')
      if (participation && participation.status !== "completed") {
        await ctx.db.patch(participation._id, { status: "completed" });
        
        // Notify the hunter immediately
        await insertNotification(ctx, {
          userId,
          type: "bounty_completed",
          title: "🎉 Bounty Completion Unlocked!",
          body: `Great work! You have finished all quests for "${bounty.name}" and earned your rewards.`,
          link: `/home/bounty/${bountyId}`,
        });
      }
    }
  }
}

/**
 * Fetches all submissions for a specific bounty, including basic user details.
 * Restricted to the bounty creator.
 */
export const getSubmissionsForBounty = query({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return [];

    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty || bounty.creatorId !== user._id) return [];

    const submissions = await ctx.db
      .query("questSubmissions")
      .withIndex("by_bountyId", (q: any) => q.eq("bountyId", args.bountyId))
      .order("desc")
      .collect();

    return await Promise.all(
      submissions.map(async (s) => {
        const submitter = await ctx.db.get(s.userId);
        return {
          ...s,
          submitterName: submitter?.name || "Anonymous Hunter",
          submitterAvatar: submitter?.userAvatar,
        };
      })
    );
  },
});

/**
 * Returns the number of bounties the user has fully completed.
 * A bounty is considered completed when the user has submitted
 * every task in that bounty (any status counts — pending/approved/rejected).
 */
export const getMyCompletedBountyCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return 0;

    // All bounties the user has ever joined
    const participations = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    let completedCount = 0;

    for (const p of participations) {
      const bounty = await ctx.db.get(p.bountyId);
      if (!bounty || !bounty.tasks || bounty.tasks.length === 0) continue;

      const totalTasks = bounty.tasks.length;

      // Get all submissions for this user + bounty
      const submissions = await ctx.db
        .query("questSubmissions")
        .withIndex("by_bountyId_userId", (q: any) =>
          q.eq("bountyId", p.bountyId).eq("userId", user._id),
        )
        .collect();

      // Count unique task indices submitted (any status counts)
      const submittedIndices = new Set(submissions.map((s: any) => s.taskIndex));

      if (submittedIndices.size >= totalTasks) {
        completedCount++;
      }
    }

    return completedCount;
  },
});

/**
 * Computes the milestone system for the Hunt to Earn widget.
 * Returns completed count, all claimed milestone keys, and the current active milestone.
 *
 */
export const getHuntBonusStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) =>
        q.eq("clerkToken", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return null;

    // ── compute completed count (same logic as above) ──
    const participations = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    let completedCount = 0;
    for (const p of participations) {
      const bounty = await ctx.db.get(p.bountyId);
      if (!bounty || !bounty.tasks || bounty.tasks.length === 0) continue;
      const totalTasks = bounty.tasks.length;
      const submissions = await ctx.db
        .query("questSubmissions")
        .withIndex("by_bountyId_userId", (q: any) =>
          q.eq("bountyId", p.bountyId).eq("userId", user._id),
        )
        .collect();
      const submittedIndices = new Set(submissions.map((s: any) => s.taskIndex));
      if (submittedIndices.size >= totalTasks) completedCount++;
    }

    // ── load claimed milestones ──
    const claims = await ctx.db
      .query("huntBonusClaims")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();
    const claimedKeys = new Set(claims.map((c: any) => c.milestoneKey));

    // ── determine milestones ──
    // m3 (3 bounties → 300 XP), m5 (5 → 500 XP), then m10, m15, m20 … (700 XP each)
    const milestones: { key: string; target: number; xp: number }[] = [
      { key: "m3", target: 3, xp: 300 },
      { key: "m5", target: 5, xp: 500 },
    ];
    // Generate repeating 700 XP milestones up to a reasonable max
    for (let n = 10; n <= Math.max(completedCount + 10, 50); n += 5) {
      milestones.push({ key: `m${n}`, target: n, xp: 700 });
    }

    // Find the next unclaimed milestone
    const nextMilestone = milestones.find(
      (m) => !claimedKeys.has(m.key),
    ) ?? milestones[milestones.length - 1];

    // Find the last claimed milestone (the one just before the next)
    const nextIdx = milestones.indexOf(nextMilestone);
    const prevTarget = nextIdx > 0 ? milestones[nextIdx - 1].target : 0;

    return {
      completedCount,
      claimedKeys: Array.from(claimedKeys),
      nextMilestone,
      prevTarget,       // starting point for the current progress bar
      canClaim: completedCount >= nextMilestone.target && !claimedKeys.has(nextMilestone.key),
    };
  },
});

/**
 * Claims the current eligible Hunt to Earn milestone bonus,
 * awarding XP to the user's character.
 */
export const claimHuntBonus = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);

    // ── compute completed bounties ──
    const participations = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();

    let completedCount = 0;
    for (const p of participations) {
      const bounty = await ctx.db.get(p.bountyId);
      if (!bounty || !bounty.tasks || bounty.tasks.length === 0) continue;
      const totalTasks = bounty.tasks.length;
      const submissions = await ctx.db
        .query("questSubmissions")
        .withIndex("by_bountyId_userId", (q: any) =>
          q.eq("bountyId", p.bountyId).eq("userId", user._id),
        )
        .collect();
      const submittedIndices = new Set(submissions.map((s: any) => s.taskIndex));
      if (submittedIndices.size >= totalTasks) completedCount++;
    }

    // ── build milestone list ──
    const claims = await ctx.db
      .query("huntBonusClaims")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();
    const claimedKeys = new Set(claims.map((c: any) => c.milestoneKey));

    const milestones: { key: string; target: number; xp: number }[] = [
      { key: "m3", target: 3, xp: 300 },
      { key: "m5", target: 5, xp: 500 },
    ];
    for (let n = 10; n <= Math.max(completedCount + 10, 50); n += 5) {
      milestones.push({ key: `m${n}`, target: n, xp: 700 });
    }

    const eligible = milestones.find(
      (m) => completedCount >= m.target && !claimedKeys.has(m.key),
    );
    if (!eligible) throw new Error("No milestone available to claim.");

    // ── award XP ──
    const prevXp = user.xp ?? 0;
    const newXp = prevXp + eligible.xp;
    const newLevel = getLevelFromXp(newXp);
    await ctx.db.patch(user._id, { xp: newXp, level: newLevel });

    // ── record claim ──
    await ctx.db.insert("huntBonusClaims", {
      userId: user._id,
      milestoneKey: eligible.key,
      xpAwarded: eligible.xp,
      claimedAt: Date.now(),
    });

    await insertNotification(ctx, {
      userId: user._id,
      type: "bounty_completed",
      title: `🏆 Hunt Bonus Claimed! +${eligible.xp} XP`,
      body: `You earned the Hunt to Earn bonus for completing ${eligible.target} bounties!`,
    });

    return { xpAwarded: eligible.xp, newXp, newLevel };
  },
});

/**
 * Administrative mutation to repair participation statuses.
 * Checks all active participations for a user and marks them as completed if all tasks are resolved.
 */
export const repairMyParticipationStatuses = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);
    
    // Find all participations that are not yet marked completed
    const participations = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => q.neq(q.field("status"), "completed"))
      .collect();

    let repairedCount = 0;
    for (const p of participations) {
      const bounty = await ctx.db.get(p.bountyId);
      if (!bounty || !bounty.tasks || bounty.tasks.length === 0) continue;

      const userSubmissions = await ctx.db
        .query("questSubmissions")
        .withIndex("by_bountyId_userId", (q: any) => 
          q.eq("bountyId", p.bountyId).eq("userId", user._id)
        )
        .collect();

      const resolvedIndices = new Set(
        userSubmissions
          .filter((s: any) => s.status === "approved" || s.status === "rejected")
          .map((s: any) => s.taskIndex)
      );

      const allTasksDone = bounty.tasks.every((_: any, i: number) => resolvedIndices.has(i));

      if (allTasksDone) {
        await ctx.db.patch(p._id, { status: "completed" });
        repairedCount++;
      }
    }

    return { repairedCount };
  },
});
