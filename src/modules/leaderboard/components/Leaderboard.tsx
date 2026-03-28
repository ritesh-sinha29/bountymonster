"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Crown, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const topThree = [
  {
    rank: 1,
    name: "Okonkwo james",
    score: "10 days",
    avatar: "https://i.pravatar.cc/150?img=12",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    rank: 2,
    name: "Okonkwo james",
    score: "5 days",
    avatar: "https://i.pravatar.cc/150?img=11",
    color: "from-slate-300 to-slate-500",
  },
  {
    rank: 3,
    name: "Okonkwo james",
    score: "3 days",
    avatar: "https://i.pravatar.cc/150?img=13",
    color: "from-amber-600 to-amber-800",
  },
];

const others = [
  { rank: 4, name: "CyberWolf", score: "2 days", avatar: "CW" },
  { rank: 5, name: "NeonRider", score: "1 day", avatar: "NR" },
  { rank: 6, name: "PixelQueen", score: "22 hours", avatar: "PQ" },
];

export function Leaderboard() {
  return (
    <div className="min-h-full w-full relative pb-12">
      {/* Podium Section */}
      <div className="relative flex items-end justify-center pt-16 sm:pt-20 mb-12 min-h-[300px] sm:min-h-[400px] gap-2 sm:gap-4 md:gap-8 px-2 sm:px-6 w-full max-w-4xl mx-auto">
        {/* Rank 2 */}
        <div className="flex flex-col items-center group relative translate-y-4 flex-1 max-w-[100px] sm:max-w-[128px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-4 sm:mb-6 relative z-10 w-full"
          >
            <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shadow-lg">
                <AvatarImage src={topThree[1].avatar} />
                <AvatarFallback>{topThree[1].name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center w-full flex flex-col items-center">
              <p className="text-[12px] sm:text-[15px] font-normal text-[#E2E4EB] font-pop tracking-tight mb-1.5 sm:mb-2 drop-shadow-md truncate w-full px-1">
                {topThree[1].name}
              </p>
              <div className="bg-[#242632] rounded-full px-2 sm:px-3 py-1 inline-flex items-center gap-1 sm:gap-1.5 shadow-sm border border-transparent">
                <span className="text-[10px] sm:text-[11px] text-gray-300 font-medium tracking-tight">
                  {topThree[1].score}
                </span>
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 fill-orange-500" />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-full h-[90px] sm:h-[130px] relative flex justify-center"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#5D616F] to-[#2A2C37] rounded-t-[12px] sm:rounded-t-[16px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.15)] backdrop-blur-sm"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)"
              }}
            />
            <span className="relative z-10 text-4xl sm:text-6xl font-bold text-white/10 font-pop select-none mt-4 sm:mt-10">
              2
            </span>
          </motion.div>
        </div>

        {/* Rank 1 */}
        <div className="flex flex-col items-center group z-20 flex-1 max-w-[120px] sm:max-w-[160px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-4 sm:mb-6 relative z-10 w-full"
          >
            <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform z-20">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shadow-xl">
                <AvatarImage src={topThree[0].avatar} />
                <AvatarFallback>{topThree[0].name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center w-full flex flex-col items-center">
              <p className="text-[13px] sm:text-[16px] font-medium text-[#E2E4EB] font-pop tracking-tight mb-1.5 sm:mb-2 drop-shadow-lg truncate w-full px-1">
                {topThree[0].name}
              </p>
              <div className="bg-[#242632] rounded-[14px] px-3 sm:px-4 py-1 sm:py-1.5 inline-flex items-center gap-1 sm:gap-1.5 shadow-md shadow-black/20 border border-transparent">
                <span className="text-[11px] sm:text-[12px] text-gray-300 font-medium tracking-tight">
                  {topThree[0].score}
                </span>
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500" />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut", delay: 0.1 }}
            className="w-full h-[140px] sm:h-[190px] relative flex justify-center z-10"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#8C90A1] to-[#353846] rounded-t-[14px] sm:rounded-t-[18px] shadow-[inset_0_8px_20px_rgba(255,255,255,0.25)] backdrop-blur-md"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)"
              }}
            />
            <span className="relative z-10 text-5xl sm:text-7xl font-bold text-white/10 font-pop select-none mt-6 sm:mt-12">
              1
            </span>
          </motion.div>
        </div>

        {/* Rank 3 */}
        <div className="flex flex-col items-center group relative translate-y-8 flex-1 max-w-[100px] sm:max-w-[128px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center mb-4 sm:mb-6 relative z-10 w-full"
          >
            <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shadow-lg">
                <AvatarImage src={topThree[2].avatar} />
                <AvatarFallback>{topThree[2].name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center w-full flex flex-col items-center">
              <p className="text-[12px] sm:text-[14px] font-normal text-[#E2E4EB] font-pop tracking-tight mb-1.5 sm:mb-2 drop-shadow-md truncate w-full px-1">
                {topThree[2].name}
              </p>
              <div className="bg-[#242632] rounded-full px-2 sm:px-3 py-1 inline-flex items-center gap-1 sm:gap-1.5 shadow-sm border border-transparent">
                <span className="text-[10px] sm:text-[11px] text-gray-300 font-medium tracking-tight">
                  {topThree[2].score}
                </span>
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 fill-orange-500" />
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
            className="w-full h-[70px] sm:h-[100px] relative flex justify-center"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#4A4D59] to-[#21232B] rounded-t-[12px] sm:rounded-t-[14px] shadow-[inset_0_4px_10px_rgba(255,255,255,0.1)] backdrop-blur-sm"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)"
              }}
            />
            <span className="relative z-10 text-4xl sm:text-6xl font-bold text-white/10 font-pop select-none mt-4 sm:mt-8">
              3
            </span>
          </motion.div>
        </div>
      </div>

      {/* List Section */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-8 pb-12">
        <div className="space-y-3">
          <h3 className="text-xs font-bold font-pop text-white/40 uppercase tracking-widest px-1 sm:px-2 mb-4">
            Hunters Ranking
          </h3>
        {others.map((hunter, index) => (
          <motion.div
            key={hunter.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-3 sm:gap-4 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group"
          >
            <div className="w-6 sm:w-8 text-xs sm:text-sm font-bold text-white/40 font-mono text-center shrink-0">
              #{hunter.rank}
            </div>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-white/10 shrink-0">
              <AvatarFallback className="bg-white/10 text-white/70 text-xs font-bold">
                {hunter.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white font-pop group-hover:text-primary transition-colors truncate">
                {hunter.name}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 rounded-lg px-2 sm:px-3 py-1 border border-white/5 shrink-0">
              <span className="text-[10px] sm:text-xs font-bold text-white font-mono">
                {hunter.score}
              </span>
              <Flame className="w-3 h-3 text-orange-500" />
            </div>
          </motion.div>
        ))}
        </div>

        {/* Current User Sticky Rank */}
        <div className="sticky bottom-4 sm:bottom-6 z-30 mt-6 sm:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-3 sm:gap-4 bg-[#161821]/95 backdrop-blur-xl border border-primary/30 rounded-xl p-3 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
            <div className="w-6 sm:w-8 text-xs sm:text-sm font-bold text-primary font-mono text-center shrink-0 relative z-10">
              #42
            </div>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-primary/30 shrink-0 relative z-10">
              <AvatarImage src="https://i.pravatar.cc/150?img=33" />
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                ME
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 relative z-10 pt-0.5">
              <p className="text-sm font-bold text-white font-pop truncate">
                You
              </p>
              <p className="text-[10px] text-primary/80 uppercase tracking-widest font-bold mt-0.5">
                Current Rank
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 rounded-lg px-2 sm:px-3 py-1.5 border border-primary/20 shrink-0 relative z-10">
              <span className="text-[10px] sm:text-xs font-bold text-primary font-mono">
                12 hours
              </span>
              <Flame className="w-3 h-3 text-orange-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

