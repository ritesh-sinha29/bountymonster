import React from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trophy, Coins, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Renders a visually faithful preview of the bounty currently being created.
 * Synchronizes with real-time form state to give creators immediate feedback.
 */
export const BountyPreview = ({ watchAll, tasksCount, reward }: { watchAll: any; tasksCount: number; reward: number }) => {
  return (
    <div className="lg:sticky lg:top-10 space-y-6">
      <div className="flex items-center justify-between px-2">
         <h2 className="text-sm font-black uppercase text-white">Spectral Preview</h2>
         <div className="flex gap-1">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
           <div className="w-2 h-2 rounded-full bg-yellow-500" />
           <div className="w-2 h-2 rounded-full bg-green-500" />
         </div>
      </div>

      <div className="rounded-[2.5rem] border-8 border-white/10 bg-black overflow-hidden shadow-2xl">
        <div className="relative h-64 w-full bg-white/5">
          {watchAll.coverImage ? (
            <motion.img 
              key={watchAll.coverImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              src={watchAll.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-3">
              <ImageIcon className="w-12 h-12" />
              <span className="text-xs font-bold uppercase tracking-widest">Awaiting Visuals</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <Badge className="bg-primary text-black font-black uppercase italic text-[10px] px-3">
              {watchAll.type || "BOUNTY"}
            </Badge>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
             <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2 wrap-break-word line-clamp-2">
               {watchAll.name || "UNNAMED BOUNTY"}
             </h3>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-orange-500">
                  <Coins className="w-3.5 h-3.5" />
                  <span className="text-xs font-black">{reward > 0 ? `${reward} Credits` : reward === 0 ? "FREE" : "INITIALIZING..."}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Trophy className="w-3.5 h-3.5" />
                  <span className="text-xs font-black">{watchAll.xpReward || 0} XP</span>
                </div>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-black">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Briefing</h4>
            <p className="text-sm text-white/70 leading-relaxed font-medium line-clamp-10 italic whitespace-pre-wrap wrap-break-word">
              {watchAll.description || "The bounty description will illuminate here once provided. Every saga needs a beginning..."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-2xl bg-white/3 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-white/30 uppercase block">Min Level</span>
                <span className="text-xl font-black text-white">{watchAll.requirementLevel || 1}</span>
             </div>
             <div className="p-4 rounded-2xl bg-white/3 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-white/30 uppercase block">Tasks Count</span>
                <span className="text-xl font-black text-white">{tasksCount}</span>
             </div>
          </div>

          <div className="pt-4">
            <div className="w-full h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
               <span className="text-lg text-muted-foreground  animate-pulse">
                 Ready for Launch
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-linear-to-br from-primary/20 to-transparent border border-primary/10">
         <div className="flex gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 h-fit">
               <ExternalLink className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1">
               <p className="font-black text-primary uppercase italic text-sm">Monster Protocol</p>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Bounties are automatically distributed across the network. High-reward bounties attract elite hunters more frequently.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
