"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BOOSTED_POSTS = [
  {
    id: 1,
    title: "The Great Hunt: Season 1",
    description:
      "Join the legendary hunt and earn exclusive badges and 10,000 XP.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800&h=400",
  },
  {
    id: 2,
    title: "Monster Arena: 2v2 Tournament",
    description:
      "Prove your skills in the arena. Top 3 teams get PRO subscriptions.",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800&h=400",
  },
  {
    id: 3,
    title: "Cyber City Protocol",
    description:
      "Decode the encrypted signals coming from the neon district. +5000 Credits.",
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800&h=400",
  },
];

export const BoostedBounties = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BOOSTED_POSTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const post = BOOSTED_POSTS[index];

  return (
    <div className="relative w-full aspect-21/9 overflow-hidden rounded-2xl border border-white/5 bg-white/2">
      <AnimatePresence mode="wait">
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 group"
        >
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full opacity-40 transition-transform duration-2000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <Badge
              variant="outline"
              className="mb-3 text-[10px] border-primary/40 text-primary bg-primary/5 uppercase font-bold tracking-widest px-3"
            >
              Featured Mission
            </Badge>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-black text-white italic uppercase tracking-tighter"
            >
              {post.title}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-sm mt-2 max-w-xl leading-relaxed italic"
            >
              {post.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-8 flex gap-1.5 z-20">
        {BOOSTED_POSTS.map((_, i) => (
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

      {/* Slide Counter */}
      <div className="absolute top-6 right-8 z-20 mix-blend-difference">
         <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">
           {String(index + 1).padStart(2, '0')} / {String(BOOSTED_POSTS.length).padStart(2, '0')}
         </span>
      </div>
    </div>
  );
};
