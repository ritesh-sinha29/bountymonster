"use client";

import { ArrowUpRight, Flame, LucidePlus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export const TrendingNow = () => {
  const trendingBounties = useQuery(api.bounties.getTrendingBounties);

  return (
    <div className="flex flex-col flex-1 max-h-[400px] bg-[#05070A] border border-white/10 rounded-xl overflow-hidden mb-6 shadow-sm">
      <div className="px-4 py-5 flex items-center justify-between border-b border-white/6 bg-black/20">
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-orange-500 fill-orange-500/20" />
          <h3 className="text-base font-semibold text-white/90 tracking-tight">
            Trending Bounties
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button size="xs" variant={"outline"} className="text-[10px] hover:text-white px-3!">
            More <LucidePlus className="size-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 scrollbar-hide bg-primary/5">
        {trendingBounties === undefined ? (
          <div className="p-3 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 w-full bg-white/3 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : trendingBounties.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {trendingBounties.map((b, index) => (
              <Link
                href={`/home/bounty/${b._id}`}
                key={b._id}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/4 transition-all group border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-mono text-white/20 tabular-nums w-4">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white/90 group-hover:text-white transition-colors truncate max-w-[150px]">
                      {b.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 uppercase tracking-tight">
                        {b.type || "SOCIAL"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-bold text-orange-500">
                      +{b.xpReward} XP
                    </span>
                    <span className="text-[9px] text-white/30 font-medium">
                      REWARD
                    </span>
                  </div>
                  <ArrowUpRight className="size-3.5 text-white/10 group-hover:text-white/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="size-10 rounded-full bg-white/2 border border-white/5 flex items-center justify-center mb-3">
              <Flame className="size-5 text-white/10" />
            </div>
            <p className="text-[13px] text-white/50 font-medium">
              No trending bounties
            </p>
            <p className="text-[11px] text-white/30 mt-1">
              Check back later for new rewards
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
