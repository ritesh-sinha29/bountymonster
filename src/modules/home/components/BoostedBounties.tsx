"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Animated carousel component for highlighting premium or featured bounties.
 * Cycles through top-tier content on an interval to draw user attention.
 */
export const BoostedBounties = () => {
  const router = useRouter();
  const boostedBounties = useQuery(api.bounties.getBoostedBounties);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!boostedBounties || boostedBounties.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % boostedBounties.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [boostedBounties]);

  if (boostedBounties === undefined) {
    return (
      <div className="w-full aspect-21/9 rounded-2xl border border-white/5 bg-white/2 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
      </div>
    );
  }

  if (boostedBounties.length === 0) {
    return (
      <div className="relative w-full aspect-21/9 overflow-hidden rounded-2xl border border-white/5 bg-white/2 group">
         <img
            src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1200&h=400"
            className="object-cover w-full h-full opacity-20 grayscale"
            alt="No boosted bounties"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-2">
             <Badge variant="outline" className="border-white/10 text-white/30 bg-white/5 uppercase font-bold tracking-widest px-3">
               Featured Content
             </Badge>
             <h3 className="text-xl font-black text-white/40 italic uppercase tracking-tighter">
                No active boosted bounties
             </h3>
             <p className="text-white/20 text-xs italic font-medium max-w-sm">
                Boost your bounty to see it featured here at the top of the monster hunt.
             </p>
          </div>
      </div>
    );
  }

  const bounty = boostedBounties[index];

  return (
    <div className="relative w-full aspect-21/9 overflow-hidden rounded-2xl border border-white/5 bg-white/2">
      <AnimatePresence mode="wait">
        <motion.div
          key={bounty._id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 group cursor-pointer"
          onClick={() => router.push(`/home/bounty/${bounty._id}`)}
        >
          <img
            src={bounty.coverImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800&h=400"}
            alt={bounty.name}
            className="object-cover w-full h-full opacity-40 transition-transform duration-2000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <Badge
              variant="outline"
              className="mb-3 text-[10px] border-primary/40 text-primary bg-primary/5 uppercase font-bold tracking-widest px-3"
            >
              Featured Bounty
            </Badge>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-black text-white italic uppercase tracking-tighter"
            >
              {bounty.name}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-sm mt-2 max-w-xl leading-relaxed italic line-clamp-2"
            >
              {bounty.description}
            </motion.p>
            
            <Link href={`/home/bounty/${bounty._id}`} className="mt-4 inline-block">
               <Button size="sm" className="bg-primary hover:brightness-110 text-[10px] font-black uppercase tracking-widest h-8">
                 View Bounty <Rocket className="ml-1.5 h-3 w-3" />
               </Button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 right-8 flex gap-1.5 z-20">
        {boostedBounties.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1 rounded-full transition-all duration-500 cursor-pointer",
              i === index 
                ? "w-8 bg-primary shadow-[0_0_12px_rgba(var(--primary),1)]" 
                : "w-2 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

      <div className="absolute top-6 right-8 z-20 mix-blend-difference">
         <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">
           {String(index + 1).padStart(2, '0')} / {String(boostedBounties.length).padStart(2, '0')}
         </span>
      </div>
    </div>
  );
};
