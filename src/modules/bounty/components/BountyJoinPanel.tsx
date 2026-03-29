"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Users, Loader2, CheckCircle2, LogOut, Crosshair } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface JoinPanelProps {
  bountyId: Id<"bounties">;
}

/**
 * Handles the user interactions for joining, viewing, or leaving a bounty.
 * Distinguishes contexts between the bounty creator, an active participant,
 * or a passing user allowing precise actions and indicating overall capacity.
 */
export function JoinPanel({ bountyId }: JoinPanelProps) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const bounty = useQuery(api.bounties.getBounty, { id: bountyId });
  const participation = useQuery(api.participants.getMyParticipation, { bountyId });
  const participantCount = useQuery(api.participants.getParticipantCount, { bountyId });

  const joinBounty = useMutation(api.participants.joinBounty);
  const leaveBounty = useMutation(api.participants.leaveBounty);
  const [loading, setLoading] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const isLoading =
    currentUser === undefined ||
    bounty === undefined ||
    participation === undefined ||
    participantCount === undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-5">
        <Loader2 className="w-4 h-4 animate-spin text-primary/40" />
      </div>
    );
  }

  const isCreator = currentUser && bounty?.creatorId === currentUser?._id;
  const isJoined = participation?.status === "active";

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinBounty({ bountyId });
      toast.success("🎯 Bounty joined! You are now a hunter.");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to join bounty");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirmLeave) {
      setConfirmLeave(true);
      setTimeout(() => setConfirmLeave(false), 3000);
      return;
    }
    setLoading(true);
    setConfirmLeave(false);
    try {
      await leaveBounty({ bountyId });
      toast.success("You've left the bounty.");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to leave bounty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-white/40 font-medium tracking-wide">
          <Users className="w-3.5 h-3.5 text-primary/50" />
          <span>
            <span className="text-white/70 font-bold">{participantCount}</span>
            {" "}hunter{participantCount !== 1 ? "s" : ""} joined
            {bounty?.maxHunters ? (
              <span className="text-white/20"> / {bounty.maxHunters} max</span>
            ) : null}
          </span>
        </div>

        {bounty?.maxHunters ? (
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, ((participantCount ?? 0) / bounty.maxHunters) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {isCreator ? (
        <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-white/30 uppercase tracking-[0.15em]">
            Your bounty
          </span>
        </div>
      ) : isJoined ? (
        <div className="space-y-2.5">
          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3.5 flex items-center justify-between group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 border border-primary/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">
                  Participated
                </p>
                <p className="text-[10px] text-white/25 font-medium mt-0.5">
                  Complete quests to earn rewards
                </p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLeave}
            disabled={loading}
            className={`w-full py-2.5 rounded-xl border text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200 flex items-center justify-center gap-2 ${
              confirmLeave
                ? "border-red-500/40 bg-red-500/10 text-red-400"
                : "border-white/[0.06] bg-transparent text-white/20 hover:text-white/40 hover:border-white/10"
            }`}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <LogOut className="w-3 h-3" />
                {confirmLeave ? "Tap again to confirm" : "Leave bounty"}
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleJoin}
          disabled={loading}
          className="relative w-full overflow-hidden rounded-xl py-3.5 flex items-center justify-center gap-2.5 font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] shadow-[0_0_24px_rgba(var(--color-primary),0.25)] hover:shadow-[0_0_36px_rgba(var(--color-primary),0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Crosshair className="w-4 h-4" />
              Join Bounty
            </>
          )}
        </button>
      )}
    </div>
  );
}
