"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  MessageCircle,
  UserPlus,
  X,
  Check,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { useRightSidebar } from "./rightSidebarProvider";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const NOTIFICATIONS = [
  {
    id: 1,
    title: "New bounty posted",
    desc: "A 500 XP bounty \"Kill 10 Goblins\" was posted near you.",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    title: "Level up!",
    desc: "You've reached Level 12. New skills unlocked.",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    title: "Achievement earned",
    desc: "You earned the \"Dragon Slayer\" badge.",
    time: "3h ago",
    read: true,
  },
  {
    id: 4,
    title: "Leaderboard update",
    desc: "You moved up to #4 on the weekly leaderboard.",
    time: "Yesterday",
    read: true,
  },
];

const FRIEND_REQUESTS = [
  {
    id: 1,
    name: "IronWraith",
    level: 9,
    mutual: 3,
    avatar: "IW",
  },
  {
    id: 2,
    name: "NightBloom",
    level: 15,
    mutual: 1,
    avatar: "NB",
  },
  {
    id: 3,
    name: "StormCaller",
    level: 7,
    mutual: 0,
    avatar: "SC",
  },
];

const CHATS = [
  {
    id: 1,
    name: "IronWraith",
    message: "Hey, want to team up for that bounty?",
    time: "Just now",
    unread: 2,
    avatar: "IW",
    online: true,
  },
  {
    id: 2,
    name: "NightBloom",
    message: "GG on the leaderboard climb 🔥",
    time: "5m",
    unread: 0,
    avatar: "NB",
    online: true,
  },
  {
    id: 3,
    name: "StormCaller",
    message: "Did you complete the cave dungeon yet?",
    time: "1h",
    unread: 1,
    avatar: "SC",
    online: false,
  },
  {
    id: 4,
    name: "DuskRider",
    message: "See you in the arena!",
    time: "3h",
    unread: 0,
    avatar: "DR",
    online: false,
  },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  label,
  online,
  size = "md",
}: {
  label: string;
  online?: boolean;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "size-8 text-[10px]" : "size-9 text-xs";
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-semibold text-primary",
          dim
        )}
      >
        {label}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-sidebar",
            online ? "bg-green-500" : "bg-sidebar-foreground/30"
          )}
        />
      )}
    </div>
  );
}

// ─── Tab: Notifications ───────────────────────────────────────────────────────

function NotificationsTab() {
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <span className="text-xs text-sidebar-foreground/50 font-medium uppercase tracking-widest">
          {items.filter((n) => !n.read).length} unread
        </span>
        <button
          onClick={markAllRead}
          className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Mark all read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {items.map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex gap-3 px-4 py-3 border-b border-white/5 transition-colors hover:bg-white/5 cursor-pointer",
              !n.read && "bg-primary/5"
            )}
          >
            <div
              className={cn(
                "mt-0.5 size-2 rounded-full shrink-0",
                !n.read ? "bg-primary" : "bg-transparent"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground leading-tight">
                {n.title}
              </p>
              <p className="text-[12px] text-sidebar-foreground/55 mt-0.5 leading-relaxed">
                {n.desc}
              </p>
              <span className="text-[11px] text-sidebar-foreground/35 mt-1 block">
                {n.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Friend Requests ─────────────────────────────────────────────────────

function FriendRequestsTab() {
  const [requests, setRequests] = useState(FRIEND_REQUESTS);

  const accept = (id: number) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));
  const decline = (id: number) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-white/10">
        <span className="text-xs text-sidebar-foreground/50 font-medium uppercase tracking-widest">
          {requests.length} pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {requests.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-sidebar-foreground/40">
            <UserPlus className="size-8 opacity-30" />
            <p className="text-sm">No pending requests</p>
          </div>
        )}

        {requests.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            <Avatar label={r.avatar} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {r.name}
              </p>
              <p className="text-[11px] text-sidebar-foreground/45">
                Lv.{r.level} · {r.mutual} mutual
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => accept(r.id)}
                className="flex items-center justify-center size-7 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                title="Accept"
              >
                <Check className="size-3.5" />
              </button>
              <button
                onClick={() => decline(r.id)}
                className="flex items-center justify-center size-7 rounded-lg bg-white/10 hover:bg-white/20 text-sidebar-foreground/60 transition-colors"
                title="Decline"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Chats ───────────────────────────────────────────────────────────────

function ChatsTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-white/20">
        <span className="text-xs text-sidebar-foreground/50 font-medium uppercase tracking-widest">
          Messages
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {CHATS.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/20 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Avatar label={c.avatar} online={c.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {c.name}
                </p>
                <span className="text-[10px] text-sidebar-foreground/35 shrink-0 ml-2">
                  {c.time}
                </span>
              </div>
              <p className="text-[12px] text-sidebar-foreground/50 truncate mt-0.5">
                {c.message}
              </p>
            </div>
            {c.unread > 0 && (
              <div className="shrink-0 size-5 rounded-full bg-primary flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">
                  {c.unread}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


type Tab = "notifications" | "requests" | "chats";

const TABS: { id: Tab; icon: React.FC<{ className?: string }>; label: string; badge?: number }[] = [
  { id: "notifications", icon: Bell, label: "Notifications", badge: 2 },
  { id: "requests", icon: UserPlus, label: "Requests", badge: 3 },
  { id: "chats", icon: MessageCircle, label: "Chats", badge: 3 },
];

export function RightSidebar() {
  const { isOpen, close } = useRightSidebar();
  const [activeTab, setActiveTab] = useState<Tab>("notifications");

  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={close}
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          "fixed right-0 inset-y-0 z-40 flex flex-col",
          "w-72 bg-sidebar border-l border-white/20",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/20 shrink-0">
          {/* Tab icons */}
          <div className="flex items-center gap-3">
            {TABS.map(({ id, icon: Icon, label, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                title={label}
                className={cn(
                  "relative flex items-center justify-center size-9 rounded-lg transition-all duration-150",
                  activeTab === id
                    ? "bg-primary text-white"
                    : "text-sidebar-foreground/50 hover:bg-white/10 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="size-4" />
                {badge && activeTab !== id && (
                  <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Close */}
          <button
            onClick={close}
            className="flex items-center justify-center size-8 rounded-lg text-sidebar-foreground/50 hover:bg-white/10 hover:text-sidebar-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab label */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <h2 className="text-base font-semibold text-sidebar-foreground">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "requests" && <FriendRequestsTab />}
          {activeTab === "chats" && <ChatsTab />}
        </div>
      </aside>
    </>
  );
}
