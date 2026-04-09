"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface HunterCardProps {
  hunter: {
    rank: number;
    name: string;
    avatar?: string | null;
    xp: number;
    level: number;
    pbCount?: number;
    userId: string;
  };
  isMyRank?: boolean;
  index?: number;
  currentUserId?: string;
  variant?: "list" | "card";
}

const initials = (name: string) => {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const HunterCard = ({
  hunter,
  isMyRank = false,
  index = 0,
  currentUserId,
  variant = "list"
}: HunterCardProps) => {
  const isMe = hunter.userId === currentUserId;
  
  const rankStyles = {
    1: { border: "border-yellow-500/50", text: "text-yellow-500", bg: "bg-yellow-500/10" },
    2: { border: "border-slate-300/50", text: "text-slate-300", bg: "bg-slate-400/10" },
    3: { border: "border-orange-700/50", text: "text-orange-700", bg: "bg-orange-800/10" },
  }[hunter.rank as 1 | 2 | 3] || { border: "border-white/10", text: "text-white/40", bg: "bg-white/5" };

  return (
    <motion.div
      initial={isMyRank ? { opacity: 0, y: 20 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: isMyRank ? 0.8 : (index % 10) * 0.05 }}
      className={cn(
        "flex items-center gap-2 sm:gap-3 rounded-2xl p-3 sm:p-4 transition-all group relative overflow-hidden",
        isMyRank 
          ? "bg-[#161821]/95 backdrop-blur-xl border border-primary/30 shadow-2xl" 
          : "bg-[#0B0C10]/50 border border-white/5 hover:bg-white/[0.07] hover:border-white/10",
        variant === "card" && "px-3.5 py-3"
      )}
    >
      {isMyRank && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
      
      {/* Rank Indicator */}
      <div className={cn(
        "flex items-center justify-center shrink-0 relative z-10",
        variant === "card" ? "w-11 h-11" : "w-14 h-14 sm:w-20 sm:h-20",
      )}>
        {[1, 2, 3].includes(hunter.rank) ? (
          <div className="relative w-full h-full flex items-center justify-center scale-110 sm:scale-125">
            {/* Wreath Background */}
            <div className={cn(
              "absolute inset-0 w-full h-full opacity-90",
              hunter.rank === 1 && "sepia-[0.8] hue-rotate-[-30deg] saturate-[3] brightness-110",
              hunter.rank === 3 && "sepia-[1] hue-rotate-[10deg] saturate-[3.5] brightness-[0.55] contrast-[1.2]",
              hunter.rank === 2 && "brightness-125 saturate-[0.5] contrast-[1.1]"
            )}>
              <img 
                src="/silver-wreath.png" 
                alt="Wreath indicator"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Stylized Rank Number */}
            <span 
              className={cn(
                "relative z-10 font-black italic select-none leading-none",
                hunter.rank === 1 && "text-[#FFD700] drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]",
                hunter.rank === 2 && "text-[#E2E8F0] drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]",
                hunter.rank === 3 && "text-[#CD7F32] drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]",
                variant === "card" ? "text-base mt-[-2px]" : "text-xl sm:text-2xl mt-[-4px]"
              )}
              style={{
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                WebkitTextStroke: '1px rgba(0,0,0,0.3)'
              }}
            >
              {hunter.rank}
            </span>
          </div>
        ) : (
          <div className={cn(
            "rounded-full border-2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10",
            rankStyles.border,
            rankStyles.bg
          )}>
            <span className={cn(
              "font-black italic tracking-tighter",
              variant === "card" ? "text-[10px]" : "text-xs sm:text-sm",
              rankStyles.text
            )}>
              #{hunter.rank}
            </span>
          </div>
        )}
      </div>



      {/* Info Section */}
      <div className="flex-1 min-w-0 relative z-10">
        <p className={cn(
          "font-bold font-pop transition-colors truncate",
          variant === "card" ? "text-[12px]" : "text-sm sm:text-base",
          isMe || isMyRank ? "text-white" : "text-[#E2E4EB] group-hover:text-primary"
        )}>
          {isMe || isMyRank ? (
            <span className="flex items-baseline gap-1">
              You{" "}
              <span className="text-white/40 font-normal text-[9px] sm:text-xs truncate tracking-normal">
                ({hunter.name})
              </span>
            </span>
          ) : (
            hunter.name
          )}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className={cn(
            "font-bold text-white/40 uppercase tracking-[0.15em] flex items-center gap-1.5",
            variant === "card" ? "text-[8px]" : "text-[10px] sm:text-[11px]"
          )}>
            LV {hunter.level}
            <span className="w-1 h-1 rounded-full bg-white/20" />
            {hunter.pbCount ?? 0} PB
          </p>
        </div>
      </div>

      {/* XP Display */}
      <div className="flex flex-col items-end shrink-0 relative z-10 pl-1">
        <div className={cn(
          "flex items-center gap-1.5 rounded-lg border transition-all",
          variant === "card" ? "px-1.5 py-0.5 border-white/[0.05] bg-white/[0.03]" : "px-2.5 py-1",
          isMyRank || isMe
            ? "bg-primary/10 border-primary/20" 
            : "bg-white/5 border-white/5 group-hover:bg-primary/5 group-hover:border-primary/10"
        )}>
          <span className={cn(
            "font-black font-mono",
            variant === "card" ? "text-[10px]" : "text-xs sm:text-sm",
            isMyRank || isMe ? "text-primary" : "text-white"
          )}>
            {hunter.xp >= 1000 && variant === "card"
              ? `${(hunter.xp / 1000).toFixed(1)}K`
              : hunter.xp.toLocaleString()}
          </span>
          <Flame className={cn(
            variant === "card" ? "size-2.5" : "w-3.5 h-3.5",
            isMyRank || isMe ? "text-orange-500 fill-orange-500" : "text-orange-500/80"
          )} />
        </div>
        <span className={cn(
          "font-black uppercase tracking-widest text-white/20 mt-0.5 mr-0.5",
          variant === "card" ? "text-[7px]" : "text-[9px]"
        )}>XP</span>
      </div>
    </motion.div>
  );
};
