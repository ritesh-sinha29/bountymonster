"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRightSidebar } from "./rightSidebarProvider";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

/**
 * Button component that triggers the right sidebar, displaying
 * indicating badges for unread user notification counts.
 */
export function RightSidebarTrigger({ className }: { className?: string }) {
  const { toggle, isOpen } = useRightSidebar();
  const unreadCount = useQuery(api.notifications.getUnreadCount) ?? 0;

  return (
    <button
      onClick={toggle}
      title="Notifications"
      className={cn(
        "relative flex items-center justify-center size-9 rounded-lg transition-all duration-150",
        isOpen
          ? "bg-primary text-white"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
        className
      )}
    >
      <Bell className="size-4" />

      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
