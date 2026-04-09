"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Coins, Trophy, CheckCircle2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { EditBountyButton } from "@/modules/bounty/components/EditBountyButton";
import { JoinPanel } from "@/modules/bounty/components/BountyJoinPanel";
import { QuestRow } from "@/modules/bounty/components/QuestRow";
import Link from "next/link";

export default function BountyDetail() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as Id<"bounties">;

  const bounty = useQuery(api.bounties.getBounty, { id: bountyId });
  const participation = useQuery(api.participants.getMyParticipation, {
    bountyId,
  });
  const participantCount = useQuery(api.participants.getParticipantCount, { bountyId });
  const allSubmissions = useQuery(api.participants.getSubmissionsForBounty, { bountyId });

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
        <div className="text-red-400 text-xl font-bold italic tracking-wider">
          BOUNTY NOT FOUND
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-white/10"
        >
          Return to HQ
        </Button>
      </div>
    );
  }

  const currencySymbol = "$";
  const rewardDisplay =
    bounty.rewardPerHunter !== undefined
      ? bounty.rewardPerHunter
      : bounty.reward;

  const isParticipating = participation?.status === "active" || participation?.status === "completed";

  return (
    <div className="min-h-full pb-20">
      {/* ── Hero Header ── */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#05070B] z-0">
          <img
            src={
              bounty.coverImage ||
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
            }
            className="w-full h-full object-cover opacity-50"
            alt="Bounty Cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 pt-8 flex flex-col justify-between">
          <div className="flex justify-between items-start w-full">
            <button
              onClick={() => router.push("/home/bounty")}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white/50 text-sm font-semibold tracking-wide transition-all duration-300 hover:text-white hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Bounties
            </button>

            <div className="flex items-center gap-3">
              {bounty.isCreator && (
                <Link href={`/home/bounty/${bountyId}/analytics`}>
                   <button className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] cursor-pointer">
                      <BarChart3 className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      View Analytics
                   </button>
                </Link>
              )}
              {/* Deferred — only renders if user is the creator */}
              <EditBountyButton
                bountyId={bounty._id}
                createdAt={bounty.createdAt}
                editedAt={bounty.editedAt}
              />
            </div>
          </div>

          <div className="pb-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {bounty.type || "FEATURED BOUNTY"}
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl max-w-4xl break-words">
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

      {/* ── Content Grid ── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left: Main Intel */}
        <div className="lg:col-span-2 space-y-10">
          {/* Briefing */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-[0.15em]">
                Bounty Briefing
              </h3>
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Hunters Joined</span>
                    <span className="text-base font-black text-white">{participantCount ?? 0}</span>
                 </div>
                 <div className="w-px h-8 bg-white/10" />
                 <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Total Quests</span>
                    <span className="text-base font-black text-white">{bounty.tasks?.length ?? 0}</span>
                 </div>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed font-medium whitespace-pre-wrap break-words">
              {bounty.description}
            </p>
          </section>

          {/* Quests */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-lg font-bold text-white/40 uppercase tracking-[0.15em]">
                Target Objectives
              </h3>
              {isParticipating && (
                <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Submit proof for each quest
                </span>
              )}
            </div>

            <div className="space-y-3">
              {bounty.tasks?.map((task: any, idx: number) => (
                <QuestRow
                  key={idx}
                  task={task}
                  idx={idx}
                  bountyId={bountyId}
                  isParticipating={isParticipating}
                  isCompleted={participation?.status === "completed"}
                  isCreator={bounty.isCreator}
                  allSubmissions={allSubmissions}
                />
              ))}
              {(!bounty.tasks || bounty.tasks.length === 0) && (
                <div className="text-white/30 italic">
                  No specific objectives defined.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Reward & Action Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-[#0A0E17] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none" />

            <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">
              Bounty Rewards
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white/60 uppercase tracking-wider text-sm">
                    Total Pool
                  </span>
                </div>
                <span className="text-2xl font-black text-green-400 tracking-tighter">
                  {currencySymbol}
                  {(bounty.reward || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white/60 uppercase tracking-wider text-sm">
                    Rewards
                  </span>
                </div>
                <span className="text-xl font-black text-orange-400 tracking-tighter">
                  {currencySymbol}
                  {(rewardDisplay || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white/60 uppercase tracking-wider text-sm">
                    Experience
                  </span>
                </div>
                <span className="text-xl font-black text-white tracking-tighter">
                  +{bounty.xpReward} XP
                </span>
              </div>
            </div>

            {/* Join / Leave — self-contained component */}
            <JoinPanel bountyId={bountyId} />

            <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-widest">
              Level {bounty.requirementLevel} Authorization Required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
