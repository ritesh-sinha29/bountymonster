import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Utility function to retrieve the currently authenticated user.
 * Throws an error if the user is unauthenticated or not found in the database.
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
 * Inserts a new notification for a specific user.
 * Notifications are created with a default 'read' status of false.
 */
export async function insertNotification(
  ctx: any,
  {
    userId,
    type,
    title,
    body,
    link,
  }: {
    userId: string;
    type: string;
    title: string;
    body: string;
    link?: string;
  },
) {
  await ctx.db.insert("notifications", {
    userId,
    type,
    title,
    body,
    link,
    read: false,
    createdAt: Date.now(),
  });
}

/**
 * Retrieves the latest 50 notifications for the authenticated user.
 */
export const getMyNotifications = query({
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

    const rows = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .order("desc")
      .take(50);

    return rows;
  },
});

/**
 * Retrieves the total count of unread notifications for the user.
 * Capped gracefully at 100 for optimal performance.
 */
export const getUnreadCount = query({
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

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => q.eq(q.field("read"), false))
      .take(100);

    return unread.length;
  },
});

/**
 * Marks a specific notification as read.
 * Validates ownership before permitting the update.
 */
export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const user = await getAuthedUser(ctx);
    const notif = await ctx.db.get(args.notificationId);
    if (!notif || notif.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.notificationId, { read: true });
  },
});

/**
 * Marks all unread notifications as read for the current user.
 * Processes up to 100 notifications concurrently per invocation.
 */
export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .filter((q: any) => q.eq(q.field("read"), false))
      .take(100);

    await Promise.all(unread.map((n: any) => ctx.db.patch(n._id, { read: true })));
  },
});
