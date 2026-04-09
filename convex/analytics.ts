import { v } from "convex/values";
import { query } from "./_generated/server";

export const getBountyMetrics = query({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty) {
      throw new Error("Bounty not found");
    }

    // 1. Engagement Stats
    const participants = await ctx.db
      .query("bountyParticipants")
      .withIndex("by_bountyId", (q) => q.eq("bountyId", args.bountyId))
      .collect();

    const totalJoined = participants.length;

    // Students who submitted at least one task
    const submissions = await ctx.db
      .query("questSubmissions")
      .withIndex("by_bountyId", (q) => q.eq("bountyId", args.bountyId))
      .collect();

    const uniqueSubmitters = new Set(submissions.map((s) => s.userId));
    const totalSubmitted = uniqueSubmitters.size;

    // 2. Velocity Stats (Time to Join)
    const ONE_HOUR = 60 * 60 * 1000;
    const SIX_HOURS = 6 * ONE_HOUR;
    const TWENTY_FOUR_HOURS = 24 * ONE_HOUR;

    let joinedWithin1h = 0;
    let joinedWithin6h = 0;
    let joinedWithin24h = 0;
    let joinedAfter24h = 0;

    participants.forEach((p) => {
      const diff = p.joinedAt - bounty.createdAt;
      if (diff <= ONE_HOUR) joinedWithin1h++;
      else if (diff <= SIX_HOURS) joinedWithin6h++;
      else if (diff <= TWENTY_FOUR_HOURS) joinedWithin24h++;
      else joinedAfter24h++;
    });

    // 3. Quality Stats (Submission Breakdown)
    const qualityStats = {
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
      pending: submissions.filter((s) => s.status === "pending").length,
      total: submissions.length,
    };

    // 4. Historical Trends (Whole Time: Creation to Deadline)
    const startTime = bounty.createdAt;
    const endTime = bounty.deadline;
    const duration = endTime - startTime;
    const STEPS = 20; // Number of data points for the visualization
    const stepSize = duration / STEPS;

    const submissionHistory = [];
    const joinHistory = [];

    for (let i = 0; i < STEPS; i++) {
      const stepStart = startTime + i * stepSize;
      const stepEnd = startTime + (i + 1) * stepSize;
      
      const subCount = submissions.filter(
        (s) => s.submittedAt >= stepStart && s.submittedAt < stepEnd
      ).length;

      const joinCount = participants.filter(
        (p) => p.joinedAt >= stepStart && p.joinedAt < stepEnd
      ).length;
      
      const dateLabel = new Date(stepStart).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });

      submissionHistory.push({
        day: i + 1,
        count: subCount,
        date: dateLabel
      });

      joinHistory.push({
        day: i + 1,
        count: joinCount,
        date: dateLabel
      });
    }

    // 5. Trend Calculations (Second Half vs First Half of lifespan)
    const getTrend = (history: any[], key: string = "count") => {
       const mid = Math.floor(history.length / 2);
       const recentHalf = history.slice(mid).reduce((acc, curr) => acc + curr[key], 0);
       const previousHalf = history.slice(0, mid).reduce((acc, curr) => acc + curr[key], 0);
       
       if (previousHalf === 0) return recentHalf > 0 ? 100 : 0;
       return Math.round(((recentHalf - previousHalf) / previousHalf) * 100);
    };

    return {
      bountyName: bounty.name,
      engagement: {
        totalJoined,
        totalSubmitted,
        ratio: totalJoined > 0 ? (totalSubmitted / totalJoined) * 100 : 0,
        trends: {
           joined: getTrend(joinHistory),
           submitted: getTrend(submissionHistory),
           ratio: totalJoined > 0 ? Math.round(((totalSubmitted / totalJoined) * 100) - 5) : 0, 
        }
      },
      velocity: {
        joinedWithin1h,
        joinedWithin6h,
        joinedWithin24h,
        joinedAfter24h,
        trend: getTrend(joinHistory),
      },
      quality: qualityStats,
      submissionHistory,
      joinHistory,
      detailedActivity: {
        submissions: qualityStats.total,
        approvals: qualityStats.approved,
        rejected: qualityStats.rejected,
        joins: totalJoined,
      }
    };

  },
});

