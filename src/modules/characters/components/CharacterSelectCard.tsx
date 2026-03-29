"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Palette,
  Lock,
  Star,
  Rotate3d,
  Undo2,
} from "lucide-react";
import { themeColors } from "@/lib/Character";

/**
 * Definition of a user-selectable game character constraint.
 */
interface Character {
  id: number;
  name: string;
  title: string;
  description: string;
  theme: string;
  image: string;
  type: string;
  maxLevel: number;
  Power: Record<string, string>;
}

interface CharacterSelectCardProps {
  character: Character;
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Interactive card component representing a single character.
 * Features a 3D flip effect to reveal detailed power matrices.
 */
export function CharacterSelectCard({
  character,
  isActive,
  isSelected,
  onSelect,
}: CharacterSelectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = themeColors[character.theme as keyof typeof themeColors] || themeColors.blue;
  const locked = character.type === "locked";

  return (
    <div className="relative group w-[220px] h-[370px] perspective-1000 mx-auto font-inter">
      <div
        className={`absolute -inset-[2px] rounded-xl transition-all duration-300 z-0 ${
          isActive
            ? "bg-linear-to-t from-primary via-primary/50 to-primary/20 opacity-100 shadow-[0_0_24px_rgba(var(--primary),0.4)]"
            : isSelected
            ? "bg-white/10 opacity-100"
            : "bg-white/5 opacity-0 group-hover:opacity-40"
        }`}
      />

      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
          Equipped
        </div>
      )}

      <div
        className={`relative w-full h-full duration-700 transition-all transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div
          className={`absolute inset-0 backface-hidden rounded-xl border border-white/10 overflow-hidden flex flex-col backdrop-blur-md shadow-2xl z-10 ${
            isActive
              ? "bg-neutral-900/40"
              : "bg-neutral-900/60 group-hover:bg-neutral-800/40"
          }`}
        >
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <motion.img
              src={character.image}
              alt={character.name}
              className="w-[110%] h-auto max-w-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 pointer-events-none transition-transform duration-500 group-hover:scale-110"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />

            <div
              className={`absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t z-20 transition-opacity duration-300 ${
                isActive
                  ? "from-primary/60 via-primary/20 to-transparent opacity-100"
                  : "from-black/60 via-black/20 to-transparent opacity-80 group-hover:from-white/10"
              }`}
            />

            <div className="absolute inset-0 flex flex-col justify-end p-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
              <button
                onClick={() => !locked && onSelect()}
                className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  locked
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : isActive
                    ? "bg-white/10 text-white/50 cursor-not-allowed"
                    : `${theme.bg} text-white hover:opacity-90 ${theme.shadow}`
                }`}
              >
                {locked ? "Locked" : isActive ? "Equipped" : "Equip"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 text-white hover:bg-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all border border-white/5"
              >
                <Rotate3d className="w-3.5 h-3.5" /> Powers
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-4 z-20 text-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
              <h2 className="text-xl font-black tracking-tighter text-white uppercase">
                {character.name}
              </h2>
              <div className="h-0.5 w-8 bg-primary mx-auto mt-1 opacity-60" />
            </div>

            <div className="absolute top-3 right-3 z-30">
              <div className={`p-1.5 rounded-lg backdrop-blur-md border border-white/10 ${locked ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"}`}>
                {locked ? <Lock className="w-3 h-3" /> : <Star className="w-3 h-3 fill-primary" />}
              </div>
            </div>
          </div>

          <div className="px-3 py-2 border-t border-white/5 bg-black/30">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.text}`}>
              {character.title}
            </p>
          </div>
        </div>

        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col z-10 ${
            isFlipped ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h3 className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Abilities
            </h3>
            <button onClick={() => setIsFlipped(false)} className="text-neutral-500 hover:text-white transition-colors p-1 bg-white/5 rounded-md">
              <Rotate3d className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 flex flex-col space-y-4 overflow-y-auto">
            <p className="text-xs text-neutral-400 italic border-l-2 border-primary/50 pl-2">
              "{character.description}"
            </p>
            <div className="space-y-3">
              {Object.entries(character.Power).map(([name, desc], idx) => (
                <div key={idx} className="p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded bg-primary/10 text-primary">
                      {idx === 0 ? <Zap className="w-3 h-3" /> : idx === 1 ? <ShieldCheck className="w-3 h-3" /> : <Palette className="w-3 h-3" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-200">{name}</span>
                  </div>
                  <p className="text-[9px] text-neutral-500 pl-8">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-white/5 bg-white/5 flex justify-center">
            <button
              onClick={() => setIsFlipped(false)}
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-primary transition-all flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 hover:border-primary/50 bg-white/5"
            >
              <Undo2 className="w-2.5 h-2.5" /> Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
