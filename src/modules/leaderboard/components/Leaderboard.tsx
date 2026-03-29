"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

/**
 * Extracts and formats up to 2 uppercase initials from a full name.
 * 
 * @param name - The full name string
 * @returns Formatted initials (e.g. "John Doe" -> "JD")
 */
function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const PODIUM_COLOR = [
  "from-[#5D616F] to-[#2A2C37]",   // Rank 2 (left)
  "from-[#8C90A1] to-[#353846]",   // Rank 1 (center)
  "from-[#4A4D59] to-[#21232B]",   // Rank 3 (right)
];

/**
 * Global Leaderboard visualizer component. Displays the top 3 characters on
 * a stylized visual podium, followed by a vertically scrolling list of the top
 * 100 hunters. Includes sticky contextual rank mapping at the bottom.
 */
export function Leaderboard() {
  const leaderboard = useQuery(api.leaderboard.getLeaderboard);
  const myRank = useQuery(api.leaderboard.getMyRank);

  const top = leaderboard ?? [];

  const slot = (rank: number) => top[rank - 1] ?? null;

  const podiumSlots = [slot(2), slot(1), slot(3)];
  const others = top.slice(3);

  return (
    <div className="min-h-full w-full relative pb-12">

      {/* ── PODIUM ── */}
      <div className="relative flex items-end justify-center pt-16 sm:pt-20 mb-12 min-h-[300px] sm:min-h-[400px] gap-2 sm:gap-4 md:gap-8 px-2 sm:px-6 w-full max-w-4xl mx-auto">

        {/* Rank 2 */}
        <div className="flex flex-col items-center group relative translate-y-4 flex-1 max-w-[100px] sm:max-w-[128px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-4 sm:mb-6 relative z-10 w-full"
          >
            {/* Silver crown */}
            <div className="relative flex items-center justify-center mb-2">
              <div className="absolute w-8 h-3 bg-slate-400/20 blur-xl rounded-full bottom-0" />
              <svg width="36" height="24" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[0_2px_6px_rgba(168,184,200,0.4)]">
                <defs>
                  <linearGradient id="crownSilver" x1="0" y1="0" x2="44" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#EAEEF2" />
                    <stop offset="50%" stopColor="#A8B8C8" />
                    <stop offset="100%" stopColor="#607080" />
                  </linearGradient>
                </defs>
                <path d="M2 26 L6 10 L14 18 L22 2 L30 18 L38 10 L42 26 Z"
                  fill="url(#crownSilver)" fillOpacity="0.15"
                  stroke="url(#crownSilver)" strokeWidth="1.5"
                  strokeLinejoin="round" strokeLinecap="round" />
                <rect x="2" y="25" width="40" height="3" rx="1.5" fill="url(#crownSilver)" fillOpacity="0.6" />
                <circle cx="22" cy="4" r="2" fill="url(#crownSilver)" />
                <circle cx="6.5" cy="11" r="1.5" fill="url(#crownSilver)" fillOpacity="0.8" />
                <circle cx="37.5" cy="11" r="1.5" fill="url(#crownSilver)" fillOpacity="0.8" />
              </svg>
            </div>
            <div className="relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
              <Avatar className={`h-12 w-12 sm:h-16 sm:w-16 shadow-lg ${!podiumSlots[0] ? "opacity-20" : ""}`}>
                {podiumSlots[0]?.avatar && (
                  <AvatarImage src={podiumSlots[0].avatar} className="object-contain" />
                )}<AvatarFallback>
                  {podiumSlots[0] ? initials(podiumSlots[0].name) : "—"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center w-full flex flex-col items-center">
              <p className={`text-[12px] sm:text-[15px] font-normal font-pop tracking-tight mb-1.5 sm:mb-2 drop-shadow-md truncate w-full px-1 ${podiumSlots[0] ? "text-[#E2E4EB]" : "text-white/20"}`}>
                {podiumSlots[0]?.name ?? "—"}
              </p>
              <div className="bg-[#242632] rounded-full px-2 sm:px-3 py-1 inline-flex items-center gap-1 sm:gap-1.5 shadow-sm border border-transparent">
                <span className={`text-[10px] sm:text-[11px] font-medium tracking-tight ${podiumSlots[0] ? "text-gray-300" : "text-white/20"}`}>
                  {podiumSlots[0] ? `${podiumSlots[0].xp.toLocaleString()} XP` : "— XP"}
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
              className={`absolute inset-0 bg-gradient-to-b ${PODIUM_COLOR[0]} rounded-t-[12px] sm:rounded-t-[16px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.15)] backdrop-blur-sm`}
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
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
            {/* Premium SVG crown */}
            <div className="relative flex items-center justify-center mb-2">
              {/* Ambient glow */}
              <div className="absolute w-10 h-4 bg-yellow-400/20 blur-xl rounded-full bottom-0" />
              <svg
                width="44"
                height="30"
                viewBox="0 0 44 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]"
              >
                <defs>
                  <linearGradient id="crownGold" x1="0" y1="0" x2="44" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F5E27A" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#A07820" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 26 L6 10 L14 18 L22 2 L30 18 L38 10 L42 26 Z"
                  fill="url(#crownGold)"
                  fillOpacity="0.15"
                  stroke="url(#crownGold)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <rect x="2" y="25" width="40" height="3" rx="1.5" fill="url(#crownGold)" fillOpacity="0.6" />
                <circle cx="22" cy="4" r="2" fill="url(#crownGold)" />
                <circle cx="6.5" cy="11" r="1.5" fill="url(#crownGold)" fillOpacity="0.8" />
                <circle cx="37.5" cy="11" r="1.5" fill="url(#crownGold)" fillOpacity="0.8" />
              </svg>
            </div>
            <div className={`relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform z-20 ${!podiumSlots[1] ? "opacity-20" : ""}`}>
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shadow-xl">
                {podiumSlots[1]?.avatar && (
                  <AvatarImage src={podiumSlots[1].avatar} className="object-contain" />
                )}<AvatarFallback>
                  {podiumSlots[1] ? initials(podiumSlots[1].name) : "—"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center w-full flex flex-col items-center">
              <p className={`text-[13px] sm:text-[16px] font-medium font-pop tracking-tight mb-1.5 sm:mb-2 drop-shadow-lg truncate w-full px-1 ${podiumSlots[1] ? "text-[#E2E4EB]" : "text-white/20"}`}>
                {podiumSlots[1]?.name ?? "—"}
              </p>
              <div className="bg-[#242632] rounded-[14px] px-3 sm:px-4 py-1 sm:py-1.5 inline-flex items-center gap-1 sm:gap-1.5 shadow-md shadow-black/20 border border-transparent">
                <span className={`text-[11px] sm:text-[12px] font-medium tracking-tight ${podiumSlots[1] ? "text-gray-300" : "text-white/20"}`}>
                  {podiumSlots[1] ? `${podiumSlots[1].xp.toLocaleString()} XP` : "— XP"}
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
              className={`absolute inset-0 bg-gradient-to-b ${PODIUM_COLOR[1]} rounded-t-[14px] sm:rounded-t-[18px] shadow-[inset_0_8px_20px_rgba(255,255,255,0.25)] backdrop-blur-md`}
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
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
            {/* Bronze crown */}
            <div className="relative flex items-center justify-center mb-2">
              <div className="absolute w-8 h-3 bg-amber-700/20 blur-xl rounded-full bottom-0" />
              <svg width="32" height="22" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[0_2px_6px_rgba(180,100,40,0.4)]">
                <defs>
                  <linearGradient id="crownBronze" x1="0" y1="0" x2="44" y2="30" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E8A870" />
                    <stop offset="50%" stopColor="#C47D3A" />
                    <stop offset="100%" stopColor="#7A4010" />
                  </linearGradient>
                </defs>
                <path d="M2 26 L6 10 L14 18 L22 2 L30 18 L38 10 L42 26 Z"
                  fill="url(#crownBronze)" fillOpacity="0.15"
                  stroke="url(#crownBronze)" strokeWidth="1.5"
                  strokeLinejoin="round" strokeLinecap="round" />
                <rect x="2" y="25" width="40" height="3" rx="1.5" fill="url(#crownBronze)" fillOpacity="0.6" />
                <circle cx="22" cy="4" r="2" fill="url(#crownBronze)" />
                <circle cx="6.5" cy="11" r="1.5" fill="url(#crownBronze)" fillOpacity="0.8" />
                <circle cx="37.5" cy="11" r="1.5" fill="url(#crownBronze)" fillOpacity="0.8" />
              </svg>
            </div>
            <div className={`relative mb-2 sm:mb-3 group-hover:scale-105 transition-transform ${!podiumSlots[2] ? "opacity-20" : ""}`}>
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shadow-lg">
                {podiumSlots[2]?.avatar && (
                  <AvatarImage src={podiumSlots[2].avatar} className="object-contain" />
                )}<AvatarFallback>
                  {podiumSlots[2] ? initials(podiumSlots[2].name) : "—"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center w-full flex flex-col items-center">
              <p className={`text-[12px] sm:text-[14px] font-normal font-pop tracking-tight mb-1.5 sm:mb-2 drop-shadow-md truncate w-full px-1 ${podiumSlots[2] ? "text-[#E2E4EB]" : "text-white/20"}`}>
                {podiumSlots[2]?.name ?? "—"}
              </p>
              <div className="bg-[#242632] rounded-full px-2 sm:px-3 py-1 inline-flex items-center gap-1 sm:gap-1.5 shadow-sm border border-transparent">
                <span className={`text-[10px] sm:text-[11px] font-medium tracking-tight ${podiumSlots[2] ? "text-gray-300" : "text-white/20"}`}>
                  {podiumSlots[2] ? `${podiumSlots[2].xp.toLocaleString()} XP` : "— XP"}
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
              className={`absolute inset-0 bg-gradient-to-b ${PODIUM_COLOR[2]} rounded-t-[12px] sm:rounded-t-[14px] shadow-[inset_0_4px_10px_rgba(255,255,255,0.1)] backdrop-blur-sm`}
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
              }}
            />
            <span className="relative z-10 text-4xl sm:text-6xl font-bold text-white/10 font-pop select-none mt-4 sm:mt-8">
              3
            </span>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-8 pb-12">
        <div className="space-y-3">
          <h3 className="text-xs font-bold font-pop text-white/40 uppercase tracking-widest px-1 sm:px-2 mb-4">
            Hunters Ranking
          </h3>

          {others.length === 0 && leaderboard !== undefined && (
            <p className="text-xs text-white/20 text-center py-4">
              No other hunters yet.
            </p>
          )}

          {others.map((hunter, index) => (
            <motion.div
              key={hunter.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 sm:gap-4 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group"
            >
              <div className="w-6 sm:w-8 text-xs sm:text-sm font-bold text-white/40 font-mono text-center shrink-0">
                #{hunter.rank}
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-white/10 shrink-0">
                {hunter.avatar && (
                  <AvatarImage src={hunter.avatar} className="object-contain" />
                )}<AvatarFallback className="bg-white/10 text-white/70 text-xs font-bold">
                  {initials(hunter.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white font-pop group-hover:text-primary transition-colors truncate">
                  {hunter.name}
                </p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 rounded-lg px-2 sm:px-3 py-1 border border-white/5 shrink-0">
                <span className="text-[10px] sm:text-xs font-bold text-white font-mono">
                  {hunter.xp.toLocaleString()} XP
                </span>
                <Flame className="w-3 h-3 text-orange-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {myRank && (
          <div className="sticky bottom-4 sm:bottom-6 z-30 mt-6 sm:mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 sm:gap-4 bg-[#161821]/95 backdrop-blur-xl border border-primary/30 rounded-xl p-3 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
              <div className="w-6 sm:w-8 text-xs sm:text-sm font-bold text-primary font-mono text-center shrink-0 relative z-10">
                #{myRank.rank}
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-primary/30 shrink-0 relative z-10">
                {myRank?.avatar && (
                  <AvatarImage src={myRank.avatar} className="object-contain" />
                )}<AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {initials(myRank.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 relative z-10 pt-0.5">
                <p className="text-sm font-bold text-white font-pop truncate">
                  You{" "}
                  <span className="text-white/40 font-normal text-xs">({myRank.name})</span>
                </p>
                <p className="text-[10px] text-primary/80 uppercase tracking-widest font-bold mt-0.5">
                  Current Rank
                </p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 rounded-lg px-2 sm:px-3 py-1.5 border border-primary/20 shrink-0 relative z-10">
                <span className="text-[10px] sm:text-xs font-bold text-primary font-mono">
                  {myRank.xp.toLocaleString()} XP
                </span>
                <Flame className="w-3 h-3 text-orange-500" />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
