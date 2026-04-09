// Convex search functions for bounty history
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Retrieves the search history for the currently authenticated user.
 * Returns the 10 most recent search queries.
 */
export const getHistory = query({
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
      .query("searchHistory")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(10);
  },
});

/**
 * Saves a new search query to the authenticated user's history.
 * If the exact same query (case-insensitive) already exists, 
 * it updates the timestamp of the existing record to make it the most recent.
 */
export const saveHistory = mutation({
  args: { queryText: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();

    if (!user) return;

    const cleanQuery = args.queryText.trim().toLowerCase();
    if (!cleanQuery) return;

    // Look for an existing match for this user
    const existing = await ctx.db
      .query("searchHistory")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("query"), cleanQuery))
      .first();

    if (existing) {
      // Move to top by updating timestamp
      await ctx.db.patch(existing._id, { createdAt: Date.now() });
    } else {
      await ctx.db.insert("searchHistory", {
        userId: user._id,
        query: cleanQuery,
        createdAt: Date.now(),
      });
    }

    // Optional: Prune old history if it exceeds a certain count (e.g. 50)
  },
});

/**
 * Deletes a specific history item by ID.
 * Ensures the item belongs back to the authenticated user.
 */
export const deleteHistory = mutation({
  args: { id: v.id("searchHistory") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();

    if (!user) return;

    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== user._id) return;

    await ctx.db.delete(args.id);
  },
});

/**
 * Clears all search history records for the current user.
 */
export const clearAllHistory = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
      .unique();

    if (!user) return;

    const histories = await ctx.db
      .query("searchHistory")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of histories) {
      await ctx.db.delete(item._id);
    }
  },
});
import { enrichBountyDoc } from "./bounties";

/**
 * Search for bounties based on a text query.
 * Matches against name, description, and type.
 * Enriches results with participant counts and user-specific status.
 */
export const searchBounties = query({
  args: { queryText: v.string() },
  handler: async (ctx, args) => {
    const searchLower = args.queryText.trim().toLowerCase();
    if (!searchLower) return [];

    // Fetch the current user for enrichment if authenticated
    const identity = await ctx.auth.getUserIdentity();
    const user = identity 
      ? await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("clerkToken", identity.tokenIdentifier))
          .unique()
      : null;

    const bounties = await ctx.db.query("bounties").collect();
    
    const results = bounties.filter((b) => 
      b.name.toLowerCase().includes(searchLower) ||
      b.description.toLowerCase().includes(searchLower) ||
      b.type.toLowerCase().includes(searchLower)
    );

    // Limit, enrich and return
    const limitedResults = results.slice(0, 24);
    
    return await Promise.all(
      limitedResults.map((b) => enrichBountyDoc(ctx, b, user))
    );
  },
});
