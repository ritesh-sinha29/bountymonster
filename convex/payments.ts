import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateUserPlan = mutation({
  args: {
    planType: v.union(v.literal("free"), v.literal("pro"), v.literal("elite")),
    subscriptionId: v.optional(v.string()), // pass on Pro upgrade; omit or pass undefined to clear
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Look up user by Clerk token — clerkToken is indexed for fast lookup (see schema.ts)
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      planType: args.planType,
      razorpaySubscriptionId: args.subscriptionId ?? undefined,
      updatedAT: Date.now(), // NOTE: typo — should be updatedAt, fix in schema.ts + all references together
    });

    return { success: true };
  },
});
