"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const TrendingNow = () => {
  const trendingBounties = useQuery(api.bounties.getTrendingBounties) || [];

  return (
    <Card className="flex flex-col flex-1 max-h-[380px] overflow-hidden bg-[#0A0D15] border border-white/[0.02] p-0 gap-0 rounded-[28px] shadow-2xl mb-6 shrink-0">
      <CardHeader className="px-6 pt-4 pb-4 border-b border-white/[0.04] bg-black rounded-t-[28px]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="size-[46px] rounded-full bg-[#18110D] border border-orange-500/10 flex items-center justify-center shrink-0">
              <Flame className="size-4 text-orange-500" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-[16px] font-bold text-white tracking-tight leading-[1.2]">
              Trending Now
            </CardTitle>
          </div>
          <button className="size-[42px] rounded-full border border-white/5 bg-[#12151E] flex items-center justify-center hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0">
            <ArrowUpRight className="size-[18px] text-white/70" strokeWidth={2} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-4 pt-2 pb-4 min-h-0">
        <div className="space-y-3 pb-2">
          {trendingBounties.map((b, index) => (
            <Link
              href={`/home/bounty/${b._id}`}
              key={b._id}
              className="relative flex flex-col w-full rounded-[14px] overflow-hidden border border-white/[0.04] group hover:border-white/10 transition-colors shrink-0 p-3 gap-1.5"
            >
              <img
                src={b.coverImage || "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800&h=400"}
                alt={b.name}
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-b from-[#0A0D15]/40 via-[#0A0D15]/80 to-[#0A0D15] mix-blend-multiply" />

              <div className="relative z-10 flex justify-between items-start">
                <Badge
                  variant="outline"
                  className="bg-orange-500/5 text-orange-500 border-orange-500/20 text-[9px] font-black uppercase tracking-widest px-1.5 py-0 rounded-[4px]"
                >
                  {b.type || "SOCIAL"}
                </Badge>
                <span className="text-[14px] font-black italic text-white/40 tracking-[0.05em] group-hover:text-white/60 transition-colors drop-shadow-md leading-none">
                  #{String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative z-10 mt-1">
                <h4 className="text-[16px] font-black italic uppercase text-white tracking-tighter truncate leading-none mb-1 shadow-black/50 drop-shadow-sm">
                  {b.name}
                </h4>
                <p className="text-[11px] text-white/60 italic leading-none truncate">
                  Earn <span className="text-[#FFB800] font-bold tracking-tight">{b.xpReward} XP</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
