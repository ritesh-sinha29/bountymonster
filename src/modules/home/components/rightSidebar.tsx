"use client";

import { cn } from "@/lib/utils";
import { Bell, X, Swords, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRightSidebar } from "./rightSidebarProvider";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";

/**
 * Returns contextual styling and iconography based on out-of-band notification types.
 */
function NotifIcon({ type }: { type: string }) {
  const base = "size-8 rounded-full flex items-center justify-center shrink-0 mt-0.5";
  if (type === "bounty_new")
    return <div className={cn(base, "bg-orange-500/20 text-orange-400")}><Swords className="size-4" /></div>;
  if (type === "bounty_joined")
    return <div className={cn(base, "bg-primary/20 text-primary")}><Trophy className="size-4" /></div>;
  if (type === "quest_submitted")
    return <div className={cn(base, "bg-blue-500/20 text-blue-400")}><CheckCircle2 className="size-4" /></div>;
  if (type === "bounty_completed")
    return <div className={cn(base, "bg-green-500/20 text-green-400")}><Sparkles className="size-4" /></div>;
  return <div className={cn(base, "bg-white/10 text-white/50")}><Bell className="size-4" /></div>;
}

/**
 * Represents a discrete notification line item inside the notification panel.
 */
function NotifRow({
  notif,
  onRead,
}: {
  notif: Doc<"notifications">;
  onRead: (id: Id<"notifications">) => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(notif.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      onClick={() => {
        if (!notif.read) onRead(notif._id);
        if (notif.link) window.location.href = notif.link;
      }}
      className={cn(
        "flex gap-3 px-4 py-3.5 border-b border-white/5 transition-colors hover:bg-white/5 cursor-pointer",
        !notif.read && "bg-primary/5"
      )}
    >
      <NotifIcon type={notif.type} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-sidebar-foreground leading-tight">
            {notif.title}
          </p>
          {!notif.read && (
            <span className="size-2 rounded-full bg-primary shrink-0 mt-1" />
          )}
        </div>
        <p className="text-[12px] text-sidebar-foreground/55 mt-0.5 leading-relaxed">
          {notif.body}
        </p>
        <span className="text-[11px] text-sidebar-foreground/35 mt-1 block">
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

/**
 * Main application Right Sidebar reserved for user notifications and updates.
 */
export function RightSidebar() {
  const { isOpen, close } = useRightSidebar();

  const notifications = useQuery(api.notifications.getMyNotifications) ?? [];
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 inset-y-0 z-40 flex flex-col",
          "w-72 bg-sidebar border-l border-white/20",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/20 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <h2 className="text-base font-semibold text-sidebar-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                {unreadCount}
              </span>
            )}
          </div>

          <button
            onClick={close}
            className="flex items-center justify-center size-8 rounded-lg text-sidebar-foreground/50 hover:bg-white/10 hover:text-sidebar-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="flex justify-end px-4 py-2 border-b border-white/10 shrink-0">
            <button
              onClick={() => markAllRead({})}
              className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Mark all read
            </button>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-sidebar-foreground/30 px-6 text-center">
              <Bell className="size-10 opacity-20" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-[12px] opacity-70">
                You'll see activity here when you join bounties, submit quests, or new high-value bounties are posted.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotifRow
                key={notif._id}
                notif={notif}
                onRead={(id) => markRead({ notificationId: id })}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
