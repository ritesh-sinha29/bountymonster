"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crosshair, ShieldCheck, CheckCircle2, Gem, Zap, Users2, Trophy, BarChart3 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";


export interface ConnectedBounty {
  _id: string;
  name: string;
  description: string;
  reward: number;
  type: string;
  coverImage: string;
  xpReward: number;
  requirementLevel: number;
  status: string;
  tasks: any[];
  rewardPerHunter?: number;
  currency?: string;
  participantCount?: number;
  isJoined?: boolean;
  isCompleted?: boolean;
  userStatus?: string | null;
  isCreator?: boolean;
  isBoosted?: boolean;
}


interface BountyCardProps {
  bounty: ConnectedBounty;
  index: number;
  currentUser?: any;
}

export const BountyCard = ({ bounty, index, currentUser }: BountyCardProps) => {
  const router = useRouter();
  
  const joinBounty = useMutation(api.participants.joinBounty);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isIneligible = (currentUser?.level ?? 1) < (bounty.requirementLevel ?? 1);
    
    if (bounty.isJoined || bounty.isCreator || isIneligible) return;

    setIsJoining(true);
    try {
      await joinBounty({ bountyId: bounty._id as Id<"bounties"> });
      toast.success(`🎯 Successfully joined ${bounty.name}!`);
    } catch (err: any) {
      toast.error(err.message ?? "Could not join bounty.");
    } finally {
      setIsJoining(false);
    }
  };

  const getButtonConfig = () => {
    if (bounty.isCreator) {
      return {
        label: "Your Bounty",
        icon: <ShieldCheck className="w-3 h-3" />,
        disabled: true,
        className: "bg-white/5 text-white/20 border border-white/5 cursor-default"
      };
    }
    if (bounty.isCompleted) {
      return {
        label: "Completed",
        icon: <Trophy className="w-3 h-3" />,
        disabled: true,
        className: "bg-green-500/20 text-green-500 border border-green-500/30 cursor-default shadow-[0_0_15px_rgba(34,197,94,0.15)]"
      };
    }
    if (bounty.isJoined) {
      return {
        label: "Joined",
        icon: <CheckCircle2 className="w-3 h-3" />,
        disabled: true,
        className: "border bg-primary cursor-default shadow-[0_0_10px_rgba(34,197,94,0.1)]"
      };
    }

    const isIneligible = (currentUser?.level ?? 1) < (bounty.requirementLevel ?? 1);
    if (isIneligible) {
      return {
        label: `Not Eligible ${bounty.requirementLevel} REQ`,
        icon: <ShieldCheck className="w-3 h-3" />,
        disabled: true,
        className: "bg-red-500/10 text-red-500 border border-red-500/20 cursor-default"
      };
    }

    return {
      label: "Join Bounty",
      icon: <Crosshair className="w-3 h-3" />,
      disabled: false,
      className: "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] shadow-[0_0_12px_rgba(var(--color-primary),0.2)] cursor-pointer"
    };
  };

  const btn = getButtonConfig();

  const handleCardClick = () => {
    router.push(`/home/bounty/${bounty._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      onHoverStart={() => router.prefetch(`/home/bounty/${bounty._id}`)}
      className={`group relative rounded-2xl border bg-[#05070B]/50 backdrop-blur-md overflow-hidden w-full flex flex-col cursor-pointer shadow-2xl transition-all duration-500 
        ${bounty.isBoosted 
          ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] ring-1 ring-white/10' 
          : 'border-white/10 hover:border-blue-500/30 hover:shadow-blue-500/10'
        }`}
    >
      {bounty.isBoosted && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-white text-black text-[8px] font-black uppercase px-2 py-1 rounded-bl-lg shadow-lg flex items-center gap-1">
            <Zap className="w-2 h-2 fill-black" />
            Featured
          </div>
        </div>
      )}
        {/* --- Image Section --- */}
        <div className="relative aspect-[3/1.5] w-full overflow-hidden border-b border-white/5">
          <img
            src={bounty.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"}
            alt={bounty.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* --- Details Section --- */}
        <div className="p-3 flex flex-col gap-2.5 bg-linear-to-b from-transparent to-white/[0.02] flex-1">
          {/* Metadata Row */}
          <div className="flex justify-between items-center w-full">
            <div className="inline-flex items-center px-1.5 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-[10px] font-medium uppercase text-blue-400 shadow-sm">
                {bounty.type || "FEATURED"}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
               <div className="flex items-center gap-1 text-white/30 group-hover:text-primary transition-colors">
                  <Gem className="w-3 h-3" />
                  <span className="text-xs font-semibold font-mono uppercase tracking-tighter">{bounty.reward}</span>
               </div>
               
               <div className="text-xs font-semibold text-white/40 tracking-widest font-mono uppercase">
                <Zap className="w-3 h-3 inline ml-1" />  {bounty.xpReward}XP
               </div>
            </div>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-black italic text-white uppercase tracking-tight leading-none drop-shadow-sm group-hover:text-blue-400 transition-colors line-clamp-1">
              {bounty.name}
            </h2>
            <p className="text-[10px] sm:text-[11px] italic text-white/30 tracking-normal font-medium leading-relaxed line-clamp-1">
              {bounty.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="mt-auto pt-2 space-y-2">
            {!bounty.isCreator ? (
              <button
                type="button"
                onClick={handleJoin}
                disabled={btn.disabled || isJoining}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-70 whitespace-nowrap ${btn.className}`}
              >
                {isJoining ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Crosshair className="w-3 h-3" />
                  </motion.div>
                ) : (
                  btn.icon
                )}
                {isJoining ? "Joining..." : btn.label}
              </button>
            ) : (
              <div className="space-y-1.5">
                {/* Analytics Button */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-primary/50 text-primary bg-primary/5 hover:bg-primary/10 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/home/bounty/${bounty._id}/analytics`);
                  }}
                >
                  <BarChart3 className="w-3 h-3" />
                  View Analytics
                </button>

                {/* Boost Button or Featured Status */}
                {bounty.isBoosted ? (
                  <div className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/[0.03] text-white/50 border border-white/5 cursor-default">
                    <Zap className="w-3 h-3 fill-white/50" />
                    Featured
                  </div>
                ) : (
                  <Link 
                    href={`/home/bounty/${bounty._id}/boost`} 
                    className="w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-white/15 active:scale-95 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 fill-white" />
                      Boost Bounty
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Footer Activity Indicator */}
          <div className="pt-2 flex items-center justify-start gap-2 border-t border-white/20 ">
           <Users2 className="w-3 h-3" /> 
           <span className="text-[10px] font-semibold text-white/70">{bounty.participantCount} Hunters Joined</span>
          </div>
        </div>
    </motion.div>
  );
};
