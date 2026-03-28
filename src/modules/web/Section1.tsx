import React from "react";
import {
  Sword,
  Shield,
  Trophy,
  Zap,
  Github,
  Users,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Target,
  LucideCrosshair,
} from "lucide-react";
import Image from "next/image";

const Section1 = () => {
  return (
    <div className="py-24 bg-black relative overflow-hidden">
      {/* Background Animated Orbs */}
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-medium text-indigo-400 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Bounty Monster Ecosystem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Level Up Your <span className="text-indigo-500">Hunt</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">
            The first mobile-first gamified arena where professional quests fuel
            your character's evolution. Earn XP, unlock legendary powers, and
            dominate the leaderboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Main Feature: Character System (Span 8) */}
          <div className="col-span-1 md:col-span-8 group relative rounded-3xl border bg-linear-to-b from-indigo-950/70 to-black p-8 overflow-hidden border-indigo-500/30 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent " />

            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:rotate-6 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Choose Your Legend
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                    Select your character class. Each hero comes with unique
                    weapons and mystical powers that unlock as you progress
                    through leagues.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Shadow Stalker", "Block Crusader", "Void Hunter"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Character Card Mockup */}
              <div className="relative w-full max-w-[280px] aspect-auto  rounded-2xl border border-white/20 bg-black p-4 shadow-2xl transition-all duration-700 group-hover:-rotate-2 group-hover:scale-105">
                <div className="absolute inset-0 bg-linear-to-b from-indigo-500/20 to-transparent opacity-50" />
                <div className="relative z-20 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <div className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">
                        Rank: Gold II
                      </div>
                      <div className="text-base font-bold text-white">
                        Void Sniper
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5 shadow-inner">
                      <Sword className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>

                  {/* IMAGE */}
                  <div className="w-full mx-auto flex items-center justify-center">
                    <Image
                      src="/3.png"
                      alt="Character"
                      width={200}
                      height={200}
                    />
                  </div>

                  <div className="space-y-3 mt-6">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[72%] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-400 font-bold font-mono">
                      <span>42,850 XP</span>
                      <span className="text-indigo-400">LVL 45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature: Quests & Proofs (Span 4) */}
          <div className="col-span-1 md:col-span-4 group relative rounded-3xl border bg-linear-to-b from-purple-950/65 to-black p-8 flex flex-col justify-between border-purple-500/30 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent " />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Proof of Glory
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Connect GitHub, share content, or conquer events. Every task is
                an opportunity to prove your skill and claim rewards.
              </p>
            </div>
            <div className="relative z-10 mt-8 space-y-3">
              {[
                {
                  label: "GitHub Star Hunt",
                  status: "Checking...",
                  icon: Github,
                },
                {
                  label: "Event Proof Upload",
                  status: "Verified",
                  icon: Sparkles,
                },
              ].map((task) => (
                <div
                  key={task.label}
                  className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3 group/item"
                >
                  <task.icon className="w-4 h-4 text-zinc-500 group-hover/item:text-purple-400 transition-colors" />
                  <span className="text-[10px] font-bold text-zinc-300 flex-1">
                    {task.label}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${task.status === "Verified" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-white/5 text-zinc-500"}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature: Leagues (Span 4) */}
          <div className="col-span-1 md:col-span-4 group relative rounded-3xl border bg-linear-to-b from-amber-950/65 to-black p-8 flex flex-col justify-between border-amber-500/30 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-amber-500/50 to-transparent " />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 mb-6 group-hover:translate-y-[-4px] transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Elite Leagues
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Unlock exclusive high-bounty tasks as you climb. Certain
                legendary quests require Platinum league status or specialized
                powers.
              </p>
            </div>
            <div className="relative z-10 mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800"
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tighter">
                1,240 Hunters in Diamond
              </span>
            </div>
          </div>

          {/* Feature: Leaderboards (Span 8) */}
          <div className="col-span-1 md:col-span-8 group relative rounded-3xl border p-8 bg-linear-to-b from-blue-950/65 to-black overflow-hidden border-blue-500/30 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-blue-500/50 to-transparent " />
            <div className="flex flex-col md:flex-row items-center gap-10 h-full">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 mb-6 group-hover:rotate-6 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Global Rankings
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Master your character and secure your spot on the global
                  stage. Top-ranked players receive exclusive seasonal perks.
                </p>
                <button className="flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:gap-3 transition-all">
                  View Rankings <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Leaderboard Mockup */}
              <div className="w-full max-w-[320px] space-y-2 relative">
                {[
                  {
                    name: "Void_Reaper",
                    level: 98,
                    xp: "1.2M",
                    color: "text-indigo-400",
                  },
                  {
                    name: "Kryptos",
                    level: 91,
                    xp: "840k",
                    color: "text-zinc-400",
                  },
                  {
                    name: "ZeroDay",
                    level: 85,
                    xp: "620k",
                    color: "text-amber-600",
                  },
                ].map((user, i) => (
                  <div
                    key={user.name}
                    className="flex items-center gap-4 p-3 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/20 transition-all group/rank"
                  >
                    <span className="text-xs font-black text-white/20">
                      0{i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white group-hover/rank:text-blue-400 transition-colors uppercase tracking-tight">
                        {user.name}
                      </div>
                      <div className="text-[9px] font-bold text-zinc-500 uppercase">
                        Lv. {user.level}
                      </div>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-zinc-300">
                      {user.xp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wide CTA: Forge Your Path (Span 12) */}
          <div className="col-span-1 md:col-span-12 group relative rounded-4xl border border-white/10 bg-linear-to-r from-indigo-900/30 via-zinc-900 to-violet-900/30 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.2),transparent)] pointer-events-none" />
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                Forge Your Path
              </h3>
              <p className="text-zinc-400 text-base md:text-lg max-w-xl">
                Ready to transform your effort into power? Join the hunt now and
                claim your first legendary perk.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-medium font-inter shadow-md shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95">
                Join the Hunt <LucideCrosshair className="w-5 h-5 inline" />
              </button>
              <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-medium font-inter backdrop-blur-md transition-all">
                Explore Quests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;
