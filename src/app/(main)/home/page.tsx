"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  Crosshair,
  Flame,
  Globe,
  Loader2,
  PlusCircle,
  Rocket,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

import { useQuery as useConvexQuery, useMutation as useConvexMutation, usePaginatedQuery as useConvexPaginatedQuery } from "convex/react";
import Link from "next/link";

import { BoostedBounties } from "@/modules/home/components/BoostedBounties";
import { TopHunters } from "@/modules/home/components/TopHunters";
import { StreaksCalendar } from "@/modules/home/components/StreaksCalendar";
import { TrendingNow } from "@/modules/home/components/TrendingNow";
import { HuntToEarn } from "@/modules/home/components/HuntToEarn";
import { ExploreBounties } from "@/modules/bounty/components/ExploreBounties";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

// ─── Real Time Data ────────────────────────────────────────────────────────────────

const HomePage = () => {
  const user = useConvexQuery(api.users.getCurrentUser);
  const logLogin = useConvexMutation(api.users.logDailyLogin);
  const { results: bounties } = useConvexPaginatedQuery(
    api.bounties.getBountiesPaginated,
    {},
    { initialNumItems: 3 }
  );

  const getBountyIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "tech": return Rocket;
      case "quest": return Flame;
      case "design": return Star;
      default: return Rocket;
    }
  };

  useEffect(() => {
    if (user) {
      logLogin({ timezoneOffset: new Date().getTimezoneOffset() }).catch(console.error);
    }
  }, [user, logLogin]);

  return (
    <div className="min-h-screen w-full flex  bg-background font-inter">
      {/* ── Left Content (Scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-20 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <h1 className="text-2xl font-semibold uppercase italic tracking-tighter">

                <Globe className="h-6 w-6 inline ml-2" />
                {"    "}
                Welcome <span className="text-primary">{user?.name}</span>
              </h1>
            </div>

            <BoostedBounties />
          </section>

          <TopHunters />

          <section className="space-y-4 pt-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Globe className="size-6 text-primary" />
                <h2 className="text-lg font-bold tracking-tight uppercase">
                  Explore <span className="text-white">Bounties</span>
                </h2>
              </div>
              <Link 
                href="/home/bounty" 
                className="cursor-pointer"
              >
                <Button size='sm' variant={'outline'} className="text-white hover:text-white px-5! text-xs">
                  View All <PlusCircle/>
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ExploreBounties bounties={bounties} currentUser={user} />
            </div>
          </section>
        </div>
      </div>

      {/* --- Right Utilities---*/}
      <div className="w-[320px] border-l border-white/10 flex flex-col pt-6 px-5 bg-sidebar shrink-0 min-h-screen">
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Calendar Section */}
          <StreaksCalendar />

          {/* Trending Now Card */}
          <TrendingNow />

          {/* Hunt to Earn */}
          <HuntToEarn />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
