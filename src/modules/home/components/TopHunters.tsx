"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Flame, PlusCircle, Trophy, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { HunterCard } from "@/modules/home/components/HunterCard";

export const TopHunters = () => {
  const user = useQuery(api.users.getCurrentUser);
  const leaderboard = useQuery(api.leaderboard.getLeaderboard, {}) ?? [];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
          <Trophy className="size-6 text-primary" />
          <h2 className="text-lg font-bold tracking-tight uppercase">
            Top <span className="text-white">Hunters</span>
          </h2>
        </div>

        <Link href="/home/leaderboard" className="cursor-pointer">
          <Button
            size="sm"
            variant={"outline"}
            className="text-white hover:text-white px-5! text-xs"
          >
            Leaderboard <Trophy />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <HunterCard 
            key={entry.userId.toString()} 
            hunter={entry} 
            index={index} 
            currentUserId={user?._id}
            variant="card"
          />
        ))}
        {leaderboard.length === 0 && (
          <div className="col-span-3 text-center flex flex-col items-center justify-center text-white/20 text-xs h-48 py-10 border border-dashed border-white/20 rounded-2xl bg-white/[0.01]">
            <UserPlus className="size-14 text-white/20" />
            <p className="text-white/20 text-base mt-2">No hunters Found yet</p>
          </div>
        )}
      </div>
    </section>
  );
};
