"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  Crosshair,
  Flame,
  Globe,
  Rocket,
  Star,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery as useConvexQuery } from "convex/react";

import { BoostedBounties } from "@/modules/home/components/BoostedBounties";
import { api } from "../../../../convex/_generated/api";
// ─── Fake Data ────────────────────────────────────────────────────────────────

const BOUNTY_DATES = [
  new Date(2026, 2, 1),
  new Date(2026, 2, 5),
  new Date(2026, 2, 8),
  new Date(2026, 2, 12),
  new Date(2026, 2, 15),
  new Date(2026, 2, 18),
  new Date(2026, 2, 19),
  new Date(2026, 2, 21),
];

const TASK_DATES = [
  new Date(2026, 2, 4),
  new Date(2026, 2, 7),
  new Date(2026, 2, 14),
  new Date(2026, 2, 20),
];

const TRENDING_BOUNTIES = [
  {
    id: 1,
    title: "DeepSeek API Integration",
    xp: 1200,
    icon: Rocket,
    category: "Tech",
  },
  {
    id: 2,
    title: "Kill the Shadow Dragon",
    xp: 5000,
    icon: Flame,
    category: "Quest",
  },
  {
    id: 3,
    title: "Design System Refactor",
    xp: 800,
    icon: Star,
    category: "Design",
  },
  {
    id: 4,
    title: "Next.js 16 Migration",
    xp: 1500,
    icon: Rocket,
    category: "Tech",
  },
  { id: 5, title: "Ice Giant Hunt", xp: 3000, icon: Flame, category: "Elite" },
];

const HomePage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const user = useConvexQuery(api.users.getCurrentUser);

  const checkDate = (day: Date, list: Date[]) =>
    list.some(
      (d) =>
        d.getDate() === day.getDate() &&
        d.getMonth() === day.getMonth() &&
        d.getFullYear() === day.getFullYear(),
    );

  return (
    <div className="min-h-screen w-full flex  bg-background font-inter">
      {/* ── Left Content (Scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-20 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <h1 className="text-2xl font-semibold uppercase italic tracking-tighter">
                Welcome <span className="text-primary">{user?.name}</span>{" "}
                <Globe className="h-6 w-6 inline ml-2" />
              </h1>
            </div>

            <BoostedBounties />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Trophy className="size-4 text-primary" />
              <h2 className="text-lg font-bold tracking-tight uppercase">
                Top <span className="text-white">Hunters</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    #{i}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold truncate leading-none">
                      Hunter_{i}k
                    </p>
                    <p className="text-[10px] text-white/40 font-medium uppercase tracking-tight mt-1">
                      {1500 - i * 100} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- Right Utilities---*/}
      <div className="w-[320px] border-l border-white/10 flex flex-col pt-6 px-5 bg-sidebar shrink-0 min-h-screen">
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Calendar Section */}
          <div className="relative bg-black rounded-xl p-4 border border-white/20 shadow-2xl overflow-hidden group shrink-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-primary rounded-b-full shadow-[0_0_20px_2px_hsl(var(--primary)/0.8)] z-10" />

            <div className="mb-2 text-center">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Streaks: 5
              </span>
            </div>

            <div className="flex justify-center -mx-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0"
                weekStartsOn={1}
                showOutsideDays={true}
                formatters={{
                  formatWeekdayName: (date) =>
                    date
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase(),
                }}
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-1",
                  month_caption:
                    "flex justify-center relative items-center h-8 mb-2",
                  caption_label:
                    "text-xs font-black text-white tracking-[0.2em] uppercase",
                  nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between pointer-events-none px-1 h-8",
                  button_previous:
                    "h-8 w-8 bg-white/[0.03] hover:bg-white/[0.08] p-0 opacity-40 hover:opacity-100 rounded-full border border-white/5 pointer-events-auto transition-all duration-300",
                  button_next:
                    "h-8 w-8 bg-white/[0.03] hover:bg-white/[0.08] p-0 opacity-40 hover:opacity-100 rounded-full border border-white/5 pointer-events-auto transition-all duration-300",
                  table: "w-full border-collapse",
                  weekdays: "flex w-full justify-between mb-2 px-1",
                  weekday:
                    "text-white/20 w-8 font-extrabold text-[9px] uppercase tracking-widest text-center",
                  week: "flex w-full mt-1 justify-between",
                  day: "h-8 w-8 text-center text-sm p-0 relative focus-within:z-20 transition-all",
                  today: "bg-white/5 rounded-full text-primary font-extrabold",
                  outside: "text-white/5 opacity-20",
                  day_button: cn(
                    "h-8 w-8 p-0 font-medium rounded-full transition-all duration-300 text-white/70 hover:bg-white/5 hover:text-white flex items-center justify-center relative",
                    "aria-selected:bg-primary! aria-selected:text-black! aria-selected:font-black aria-selected:shadow-[0_0_20px_hsl(var(--primary)/0.8)] aria-selected:scale-110",
                  ),
                }}
                modifiers={{
                  hasBounty: (d) => checkDate(d, BOUNTY_DATES),
                  hasTask: (d) => checkDate(d, TASK_DATES),
                }}
                modifiersClassNames={{
                  hasBounty: "bg-primary/20! text-primary! font-bold",
                  hasTask: "bg-secondary/30! text-secondary! font-bold",
                }}
              />
            </div>
          </div>

          {/* Trending Now Card */}
          <Card className="flex flex-col flex-1 min-h-[320px] max-h-[360px] overflow-hidden bg-card border p-0 gap-0">
            <CardHeader className="px-5 pt-4 border-b border-white/10">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded bg-primary/10 flex items-center justify-center border">
                    <Flame className="size-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-medium text-white">
                    Trending Right Now
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="hover:text-white"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2 h-[400px]">
              <div className="space-y-1">
                {TRENDING_BOUNTIES.map((b) => (
                  <div
                    key={b.id}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="size-9 rounded-md bg-black/40 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/20 transition-all">
                      <b.icon
                        className={cn(
                          "size-3",
                          b.id === 2 ? "text-orange-500" : "text-primary",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold truncate tracking-tight text-white/90">
                          {b.title}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">
                          {b.category}
                        </span>
                        <span className="text-[10px] text-primary font-black">
                          {b.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goal */}
          <div className="pb-6">
            <div className="p-4 rounded-xl bg-linear-to-br from-primary/40 to-transparent border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 opacity-15 group-hover:rotate-12 transition-transform duration-500">
                <Star className="size-12" />
              </div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-base text-white font-semibold font-pop">
                  Hunt to Earn
                </p>
              </div>
              <h4 className="text-sm text-neutral-300 leading-tight mb-3">
                Hunt 5 more for +500 XP bonus!
              </h4>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[40%] rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
