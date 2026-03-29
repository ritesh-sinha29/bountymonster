"use client";

import React, { useState } from "react";
import { Loader2, Star, Zap } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

export const HuntToEarn = () => {
  const huntBonus = useQuery(api.participants.getHuntBonusStatus);
  const claimHuntBonus = useMutation(api.participants.claimHuntBonus);
  const [claiming, setClaiming] = useState(false);

  // Compute progress values
  const completed = huntBonus?.completedCount ?? 0;
  const next = huntBonus?.nextMilestone ?? { target: 3, xp: 300, key: "m3" };
  const prevTarget = huntBonus?.prevTarget ?? 0;
  const canClaim = huntBonus?.canClaim ?? false;

  const rangeSize = next.target - prevTarget;
  const intoRange = Math.min(completed - prevTarget, rangeSize);
  const pct = rangeSize > 0 ? Math.round((intoRange / rangeSize) * 100) : 0;

  const remaining = Math.max(0, next.target - completed);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const result = await claimHuntBonus({});
      toast.success(`🏆 +${result.xpAwarded} XP claimed!`);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to claim bonus");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="pb-6 shrink-0 z-10">
      <div className="p-4 rounded-xl bg-linear-to-br from-primary/40 to-transparent border relative overflow-hidden group flex flex-col">
        <div className="absolute top-0 right-0 p-1 opacity-[0.05] pointer-events-none group-hover:rotate-12 transition-transform duration-500 z-0">
          <Star className="size-28 -translate-y-4 translate-x-4" />
        </div>

        <div className="z-10 relative">
          <div className="flex justify-between items-center mb-1">
            <p className="text-base text-white font-semibold font-pop">Hunt to Earn</p>
            <div className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 z-10">
              <Zap className="size-2.5" />
              +{next.xp} XP
            </div>
          </div>

          <h4 className="text-[13px] text-neutral-300 leading-tight z-10 relative mb-5">
            {huntBonus === undefined
              ? "Loading..."
              : canClaim
              ? `🎉 Goal reached! Claim your +${next.xp} XP bonus!`
              : `Complete ${remaining} more bounti${remaining === 1 ? "y" : "es"} for +${next.xp} XP!`}
          </h4>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest uppercase text-white/40">
              Progress
            </span>
            <span className="text-[10px] text-white/60 font-medium">
              <span className="text-white font-bold">{completed}</span> / {next.target}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.4)] transition-all duration-700"
                style={{ width: `${canClaim ? 100 : pct}%` }}
              />
            </div>

            {canClaim && (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="flex items-center gap-1.5 px-3 py-1 -my-2 rounded-lg bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-widest hover:bg-primary/80 active:scale-95 transition-all shadow-[0_0_12px_rgba(var(--primary),0.5)] disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {claiming ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Zap className="size-3 fill-current" />
                )}
                Claim
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
