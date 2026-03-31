import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Upsert a subscription record.
 * Called by the Polar webhook handler on order.paid, subscription.created,
 * and subscription.updated events.
 *
 * Uses polarSubscriptionId as the unique key so that renewals and
 * plan changes update the existing row instead of creating a duplicate.
 */
export const upsertSubscription = mutation({
  args: {
    clerkId: v.string(),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    productId: v.string(),
    priceId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_polarSubscriptionId", (q) =>
        q.eq("polarSubscriptionId", args.polarSubscriptionId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        priceId: args.priceId,
        productId: args.productId,
        currentPeriodEnd: args.currentPeriodEnd,
        polarCustomerId: args.polarCustomerId,
      });
    } else {
      await ctx.db.insert("subscriptions", {
        clerkId: args.clerkId,
        polarCustomerId: args.polarCustomerId,
        polarSubscriptionId: args.polarSubscriptionId,
        productId: args.productId,
        priceId: args.priceId,
        status: args.status,
        currentPeriodEnd: args.currentPeriodEnd,
      });
    }
  },
});

/**
 * Mark a subscription as canceled.
 * Called on subscription.revoked events.
 */
export const cancelSubscription = mutation({
  args: {
    polarSubscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_polarSubscriptionId", (q) =>
        q.eq("polarSubscriptionId", args.polarSubscriptionId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { status: "canceled" });
    }
  },
});

/**
 * Get a user's active subscription by their Clerk ID.
 * Used by the /api/portal route to get their polarCustomerId.
 */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});
