"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Zap, Target, CheckCircle2, Trophy, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BountyDetail() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as Id<"bounties">;
  
  const bounty = useQuery(api.bounties.getBounty, { id: bountyId });

  if (bounty === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (bounty === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-red-400 text-xl font-bold italic tracking-wider">MISSION NOT FOUND</div>
        <Button variant="outline" onClick={() => router.back()} className="border-white/10">Return to HQ</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20">
      {/* Hero Header */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#05070B] z-0">
          <img 
            src={bounty.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"} 
            className="w-full h-full object-cover opacity-50"
            alt="Mission Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/80 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 pt-8 flex flex-col justify-between">
          <Button 
            onClick={() => router.back()}
            variant="ghost" 
            className="w-fit text-white/60 hover:text-white hover:bg-white/5 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bounties
          </Button>

          <div className="pb-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {bounty.type || "FEATURED MISSION"}
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl max-w-4xl">
              {bounty.name}
            </h1>
            <div className="flex items-center gap-6 text-sm font-medium text-white/50 tracking-widest uppercase">
              <span className="flex items-center gap-2 text-primary font-bold">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {bounty.status}
              </span>
              <span>Level {bounty.requirementLevel} Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Intel */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white/40 uppercase tracking-[0.15em] border-b border-white/5 pb-2">Mission Briefing</h3>
            <p className="text-white/80 leading-relaxed font-medium">
              {bounty.description}
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white/40 uppercase tracking-[0.15em] border-b border-white/5 pb-2">Target Objectives</h3>
            <div className="space-y-3">
              {bounty.tasks?.map((task: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="mt-0.5">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{task.name}</h4>
                    {task.description && <p className="text-sm text-white/50 mt-1">{task.description}</p>}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-md bg-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      +{task.xp || 50} XP
                    </div>
                  </div>
                </div>
              ))}
              {(!bounty.tasks || bounty.tasks.length === 0) && (
                <div className="text-white/30 italic">No specific objectives defined.</div>
              )}
            </div>
          </section>
        </div>

        {/* Reward & Action Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-[#0A0E17] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none" />
            
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Mission Rewards</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white/60 uppercase tracking-wider text-sm">Bounty</span>
                </div>
                <span className="text-2xl font-black text-green-400 tracking-tighter">${bounty.reward.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white/60 uppercase tracking-wider text-sm">Experience</span>
                </div>
                <span className="text-xl font-black text-white tracking-tighter">+{bounty.xpReward} XP</span>
              </div>
            </div>

            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all">
              Accept Mission
            </Button>
            <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-widest">
              Level {bounty.requirementLevel} Authorization Required
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
