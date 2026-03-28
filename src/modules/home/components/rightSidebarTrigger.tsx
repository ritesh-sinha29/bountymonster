"use client";

import { Bell, MessageCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRightSidebar } from "./rightSidebarProvider";

// Total badge count across all tabs
const TOTAL_BADGE = 8;

export function RightSidebarTrigger({ className }: { className?: string }) {
  const { toggle, isOpen } = useRightSidebar();

  return (
    <button
      onClick={toggle}
      title="Toggle panel"
      className={cn(
        "relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-150",
        isOpen
          ? "bg-primary text-white"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
        className
      )}
    >
      {/* Three mini icons stacked */}
      <div className="flex items-center gap-4">
        <Bell className="size-4" />
        <UserPlus className="size-4" />
        <MessageCircle className="size-4" />
      </div>

      {/* Badge */}
      {!isOpen && TOTAL_BADGE > 0 && (
        <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
          {TOTAL_BADGE}
        </span>
      )}
    </button>
  );
}
