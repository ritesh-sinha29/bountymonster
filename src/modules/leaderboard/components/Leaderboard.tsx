"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";


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

const LaurelMedal = ({ rank, variant, size = 120, className = "" }: { rank: number | string, variant: "gold" | "silver" | "bronze", size?: number, className?: string }) => {
  const filterStyle = 
    variant === "gold" ? "sepia-[0.8] hue-rotate-[-30deg] saturate-[3] brightness-110" :
    variant === "bronze" ? "sepia-[1] hue-rotate-[10deg] saturate-[3.5] brightness-[0.55] contrast-[1.2]" :
    "";
    
  const textProps = {
    gold: { grad: "from-[#FFF4D2] via-[#E2B961] to-[#A36C22]" },
    silver: { grad: "from-[#FFFFFF] via-[#C5D0DE] to-[#808E9E]" },
    bronze: { grad: "from-[#FADBCC] via-[#C97A59] to-[#8C4328]" },
  }[variant] || { grad: "from-[#FFF] to-[#AAA]" };
    
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="relative w-full aspect-square drop-shadow-2xl flex items-center justify-center">
        <div className={`absolute inset-0 w-full h-full ${filterStyle}`}>
          <Image 
            src="/silver-wreath.png" 
            alt={`${variant} wreath`}
            fill
            className="object-contain"
            quality={100}
            priority
          />
        </div>
        <span 
          className={`absolute z-10 bg-gradient-to-b ${textProps.grad} bg-clip-text text-transparent`}
          style={{ 
            marginTop: -(size * 0.12),
            fontSize: size * 0.28, 
            fontFamily: "'Georgia', 'Times New Roman', serif", 
            fontWeight: 400,
            filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.8)) drop-shadow(0px 4px 6px rgba(0,0,0,0.4))' 
          }}
        >
          {rank}
        </span>
      </div>
    </div>
  );
};

/**
 * Global Leaderboard visualizer component. Displays the top 3 characters on
 * a stylized visual podium, followed by a vertically scrolling list of the top
 * 100 hunters. Includes sticky contextual rank mapping at the bottom.
 */
export function Leaderboard() {
  const [timeframe, setTimeframe] = React.useState<"weekly" | "monthly">("monthly");
  const leaderboard = useQuery(api.leaderboard.getLeaderboard);
  const myRank = useQuery(api.leaderboard.getMyRank);

  const top = leaderboard ?? [];

  const slot = (rank: number) => top[rank - 1] ?? null;

  const podiumSlots = [slot(2), slot(1), slot(3)];
  const others = top.slice(3);

  return (
    <div className="min-h-full w-full relative pb-12 pt-6 sm:pt-8" style={{ background: "linear-gradient(150deg, #080B14 0%, #090C17 40%, #08080F 70%, #060810 100%)" }}>

      {/* ── DECORATIVE BACKGROUND LAYER (sketch style) ── */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">

        {/* SVG filter defs – sketch / hand-drawn distortion */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="sketch" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035 0.055" numOctaves="4" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="sketch-sm" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04 0.07" numOctaves="3" seed="12" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* Ambient glow – warm orange, top-center */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(243,85,32,0.07) 0%, transparent 68%)" }} />

        {/* Ambient glow – cool indigo, bottom-right */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px]" style={{ background: "radial-gradient(ellipse at bottom right, rgba(101,124,255,0.06) 0%, transparent 65%)" }} />

        {/* Trophy cup – top-left (sketch) */}
        <svg className="absolute top-[5%] left-[3%] opacity-[0.06] -rotate-6" width="80" height="96" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
          {/* double-stroke for sketch feel */}
          <path d="M11.5 4.5h33v22c0 11.046-7.163 20-16 20S11.5 37.546 11.5 27V4.5z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
          <path d="M12.5 4h32v21c0 10.8-7 19.5-16 19.5S12.5 36.4 12.5 25V4z" stroke="white" strokeWidth="0.7" strokeLinejoin="round" strokeLinecap="round" strokeOpacity="0.5"/>
          <path d="M11.5 14H3.5C3.5 27 9 35 12 36.5M44.5 14h8C52.5 27 47 35 44 36.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M27.5 46.5v10M19.5 56.5h17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <rect x="12.5" y="62" width="31" height="6" rx="3" stroke="white" strokeWidth="1.8"/>
        </svg>

        {/* Medal circle – top-right (sketch) */}
        <svg className="absolute top-[10%] right-[5%] opacity-[0.055]" width="68" height="68" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
          <circle cx="32" cy="32" r="27.5" stroke="white" strokeWidth="2"/>
          <circle cx="32" cy="32" r="27" stroke="white" strokeWidth="0.6" strokeOpacity="0.4"/>
          <circle cx="32" cy="32" r="19.5" stroke="white" strokeWidth="1.2"/>
          <path d="M32 17.5v5M32 41.5v5M17.5 32h5M41.5 32h5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M25.5 32a6.5 6.5 0 1 1 13 0" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M32 39v-7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>

        {/* Trophy cup – center-right, faint (sketch) */}
        <svg className="absolute top-[40%] right-[2%] opacity-[0.04] rotate-[14deg]" width="56" height="68" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
          <path d="M12 4h32v22c0 11.046-7.163 20-16 20S12 37.046 12 26V4z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
          <path d="M12.5 4.5h31v21c0 10.6-7 19-15.5 19S13 36.8 13 25.5V4.5z" stroke="white" strokeWidth="0.6" strokeLinejoin="round" strokeOpacity="0.4"/>
          <path d="M12 14H4C4 27 9.5 34 12 36M44 14h8C52 27 46.5 34 44 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M28 46v10M20 56h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <rect x="13" y="62" width="30" height="6" rx="3" stroke="white" strokeWidth="1.8"/>
        </svg>

        {/* Flame – bottom-left (sketch) */}
        <svg className="absolute bottom-[18%] left-[4%] opacity-[0.055]" width="50" height="64" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch-sm)" }}>
          <path d="M16 2C16 2 23.5 11 23.5 20c0 3.866-3.134 7-7.5 7s-7.5-3.134-7.5-7c0-2 1-4 1-4S5.5 18.5 5.5 24c0 9.941 4.7 18 10.5 18s10.5-8.059 10.5-18C26.5 12 16 2 16 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 2.5C16.5 2.5 23 11 23 19.5" stroke="white" strokeWidth="0.7" strokeLinecap="round" strokeOpacity="0.4"/>
          <path d="M16 30.5c0 2.4-1.5 4.2-3.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        {/* Bounty shield – bottom-right (sketch) */}
        <svg className="absolute bottom-[22%] right-[6%] opacity-[0.052]" width="56" height="66" viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch)" }}>
          <path d="M24 4L6 12v16c0 12.15 7.8 22.4 18 26 10.2-3.6 18-13.85 18-26V12L24 4z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M24.5 4.5L6.5 12.5v15.5c0 12 7.6 22 17.5 25.8" stroke="white" strokeWidth="0.6" strokeLinecap="round" strokeOpacity="0.35"/>
          <path d="M15.5 28l6.5 6.5 11-13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* Small trophy – bottom center-left, faint (sketch) */}
        <svg className="absolute bottom-[6%] left-[35%] opacity-[0.035]" width="40" height="48" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch-sm)" }}>
          <path d="M12 4h32v22c0 11.046-7.163 20-16 20S12 37.046 12 26V4z" stroke="white" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M12 14H4C4 27 9.5 34 12 36M44 14h8C52 27 46.5 34 44 36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M28 46v10M20 56h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <rect x="13" y="62" width="30" height="6" rx="3" stroke="white" strokeWidth="1.8"/>
        </svg>

        {/* Star/spark – mid-left (sketch) */}
        <svg className="absolute top-[28%] left-[7%] opacity-[0.045]" width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "url(#sketch-sm)" }}>
          <path d="M16 2l2.9 8.9H28l-7.4 5.4 2.8 8.7L16 19.8l-7.4 5.2 2.8-8.7L4 11h9.1L16 2z" stroke="white" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
          <path d="M16 3l2.6 8.6H27.5l-7 5.2 2.6 8.3L16 20.2" stroke="white" strokeWidth="0.6" strokeLinejoin="round" strokeOpacity="0.35"/>
        </svg>

        {/* Subtle horizontal accent line */}
        <div className="absolute top-[52%] left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.025) 25%, rgba(255,255,255,0.025) 75%, transparent 100%)" }} />
      </div>



      {/* ── BANNER ── */}
      <div className="w-full max-w-[56rem] mx-auto px-4 sm:px-6 mb-8 relative z-20">
        <div className="relative bg-[#1A1D2A]/80 backdrop-blur-md rounded-2xl sm:rounded-[24px] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center pt-32 pb-8 md:py-10 px-6 sm:px-10 md:pl-[280px] min-h-[160px] overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />

          {/* Trophy Image */}
          <div className="absolute top-[-30px] md:top-1/2 md:-translate-y-1/2 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-2 w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 shrink-0 z-10 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <Image 
              src="/leaderboard_cup.svg" 
              alt="Leaderboard Trophy" 
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Medal Image (Right Bottom) */}
          <div className="absolute bottom-[-10px] right-[-10px] sm:bottom-0 sm:right-2 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 shrink-0 z-10 pointer-events-none drop-shadow-xl opacity-90">
            <Image 
              src="/medal.png" 
              alt="Medal Decoration" 
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Banner Content */}
          <div className="relative z-20 flex flex-col items-center md:items-start text-center md:text-left w-full">
            {/* Logos / Title Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mb-4 sm:mb-5">
              <span className="text-xl sm:text-[22px] font-bold text-white tracking-tight flex items-center">
                Bounty Monster <span className="inline-block w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full bg-[#F35520] ml-2.5 shadow-[0_0_12px_rgba(243,85,32,0.4)]" />
              </span>
              
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="w-6 h-6 sm:w-[26px] sm:h-[26px] shrink-0 relative">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#657CFF] drop-shadow-md">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-lg sm:text-[20px] font-black text-white uppercase tracking-wider font-pop">
                  TOP HUNTERS
                </span>
              </div>
            </div>

            {/* Description Text */}
            <p className="text-[#989CAF] text-xs sm:text-[14px] font-medium leading-[1.65] max-w-[420px]">
              Level up your game! Take on bounties, grow your XP, and climb the leaderboard. The best hunters take home exclusive monthly rewards from <span className="text-[#F35520] font-bold">Bounty Monster</span>.
            </p>
          </div>
          
          {/* Decorative crown icon */}
          <div className="absolute bottom-[-10px] left-[45%] md:left-[55%] -translate-x-1/2 opacity-[0.03] select-none pointer-events-none">
            <svg width="60" height="40" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 26 L6 10 L14 18 L22 2 L30 18 L38 10 L42 26 Z" stroke="white" strokeWidth="3" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── TIMEFRAME TOGGLE ── */}
      <div className="flex justify-center w-full mb-8 relative z-20">
        <div className="bg-[#11131A]/80 backdrop-blur-md p-1.5 rounded-full border border-white/5 flex items-center shadow-xl">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-8 py-2 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 ${
              timeframe === "weekly"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-8 py-2 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 ${
              timeframe === "monthly"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* ── PODIUM ── */}
      <div className="relative flex items-end justify-center pt-8 sm:pt-6 mb-12 min-h-[300px] sm:min-h-[400px] gap-2 sm:gap-4 md:gap-8 px-2 sm:px-6 w-full max-w-4xl mx-auto">

        {/* Rank 2 */}
        <div className="flex flex-col items-center group relative translate-y-4 flex-1 max-w-[100px] sm:max-w-[128px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-4 sm:mb-6 relative z-10 w-full"
          >
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
            className="w-full h-[90px] sm:h-[130px] relative flex items-center justify-center"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b ${PODIUM_COLOR[0]} rounded-t-[12px] sm:rounded-t-[16px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.15)] backdrop-blur-sm`}
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
              }}
            />
            <div className="relative z-10 flex items-center justify-center w-full pointer-events-none drop-shadow-2xl">
              <LaurelMedal rank={2} variant="silver" size={130} className="sm:scale-110" />
            </div>
          </motion.div>
        </div>

        {/* Rank 1 */}
        <div className="flex flex-col items-center group z-20 flex-1 max-w-[120px] sm:max-w-[160px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-4 sm:mb-6 relative z-10 w-full"
          >
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
            className="w-full h-[140px] sm:h-[190px] relative flex items-center justify-center z-10"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b ${PODIUM_COLOR[1]} rounded-t-[14px] sm:rounded-t-[18px] shadow-[inset_0_8px_20px_rgba(255,255,255,0.25)] backdrop-blur-md`}
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
              }}
            />
            <div className="relative z-10 flex items-center justify-center w-full pointer-events-none drop-shadow-2xl">
              <LaurelMedal rank={1} variant="gold" size={170} className="sm:scale-125" />
            </div>
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
            className="w-full h-[70px] sm:h-[100px] relative flex items-center justify-center"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b ${PODIUM_COLOR[2]} rounded-t-[12px] sm:rounded-t-[14px] shadow-[inset_0_4px_10px_rgba(255,255,255,0.1)] backdrop-blur-sm`}
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
              }}
            />
            <div className="relative z-10 flex items-center justify-center w-full pointer-events-none drop-shadow-2xl">
              <LaurelMedal rank={3} variant="bronze" size={110} className="sm:scale-110" />
            </div>
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
