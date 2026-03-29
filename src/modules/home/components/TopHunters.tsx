"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Flame, Trophy } from "lucide-react";

export const TopHunters = () => {
  const user = useQuery(api.users.getCurrentUser);
  const leaderboard = useQuery(api.leaderboard.getLeaderboard) ?? [];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Trophy className="size-4 text-primary" />
        <h2 className="text-lg font-bold tracking-tight uppercase">
          Top <span className="text-white">Hunters</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {leaderboard.slice(0, 3).map((entry) => (
          <div
            key={entry.userId.toString()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0D1117]/80 backdrop-blur-sm border border-white/[0.04] hover:border-white/10 hover:bg-[#111720] transition-all group"
          >
            {/* Rank Badge */}
            <div className={cn(
              "size-6.5 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 border-2",
              entry.rank === 1 && "bg-yellow-500/10 border-yellow-500 text-yellow-500",
              entry.rank === 2 && "bg-slate-400/10 border-slate-400 text-slate-400",
              entry.rank === 3 && "bg-orange-600/10 border-orange-600 text-orange-600",
            )}>
              #{entry.rank}
            </div>

            {/* Avatar with Ring */}
            <div className="relative shrink-0">
              <div className="size-9 rounded-full p-0.5 border border-white/5 bg-white/5 ring-1 ring-white/10 overflow-hidden">
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} className="size-full rounded-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center text-white/30 text-[10px] font-black">
                    {entry.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-black text-white leading-tight truncate">
                {entry.userId === user?._id ? (
                  <span className="flex items-baseline gap-1">
                    You <span className="text-white/20 font-medium text-[9px] truncate">({user?.name})</span>
                  </span>
                ) : (
                  entry.name
                )}
              </p>
              <p className="text-[8px] font-black uppercase tracking-widest text-[#7A7D85]">
                LV {entry.level} <span className="mx-0.5 opacity-20">•</span> {(entry as any).bountiesPlayed || 0} PB
              </p>
            </div>

            {/* High Contrast Score */}
            <div className="flex flex-col items-end shrink-0 pl-1">
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] font-black text-white italic">
                  {entry.xp >= 1000 ? `${(entry.xp / 1000).toFixed(1)}K` : entry.xp}
                </span>
                <Flame className="size-3 text-orange-500 fill-orange-500" />
              </div>
              <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.1em] -mt-1">XP</span>
            </div>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <div className="col-span-3 text-center text-white/20 text-xs py-10 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            Waiting for more hunters...
          </div>
        )}
      </div>
    </section>
  );
};
