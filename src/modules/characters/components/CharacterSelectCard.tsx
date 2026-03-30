"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Palette,
  Lock,
  Star,
  Settings,
  Sparkles,
  Undo2,
  Swords
} from "lucide-react";
import { themeColors } from "@/lib/Character";

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

const CornerOrnaments = ({ type, color }: { type: string, color: string }) => {
  if (type === "ribbon") {
    return (
      <div className="absolute -top-1 -left-1 w-12 h-20 shadow-lg z-30" style={{ background: `linear-gradient(to bottom, ${color}, #4c1d95)`, clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)" }}>
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <Star className="w-5 h-5 text-white/90 drop-shadow-md" fill="currentColor" />
        </div>
      </div>
    );
  }
  
  if (type === "gears") {
    return (
      <>
        <div className="absolute -top-2 -left-2 z-30 opacity-80" style={{ color }}>
          <Settings className="w-8 h-8 drop-shadow-md" />
        </div>
        <div className="absolute -top-2 -right-2 z-30 opacity-80" style={{ color }}>
          <Settings className="w-8 h-8 drop-shadow-md text-white/90" />
        </div>
      </>
    );
  }

  if (type === "swirls") {
    return (
      <div className="absolute top-0 right-0 w-16 h-16 z-30 overflow-hidden pointer-events-none opacity-60">
        <svg viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="4">
          <path d="M100 0 Q50 50 100 100 M100 -20 Q20 50 100 120" />
        </svg>
      </div>
    );
  }

  if (type === "runes") {
    return (
       <div className="absolute -top-3 -right-3 z-30 opacity-70 border border-white/20 p-2 rounded-full" style={{ backgroundColor: color }}>
         <Sparkles className="w-4 h-4 text-white" />
       </div>
    );
  }

  // Default Star
  return (
    <div className="absolute top-3 right-3 z-30 drop-shadow-lg">
      <Star className="w-5 h-5 text-white opacity-80" fill="currentColor" />
    </div>
  );
};

export function CharacterSelectCard({
  character,
  isActive,
  isSelected,
  onSelect,
}: CharacterSelectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const theme = (themeColors as any)[character.theme] || themeColors.blue;
  const locked = character.type === "locked";

  const borderColor = theme.borderColorHex || "#ffffff";
  const bgPattern = theme.bgPattern || "none";

  return (
    <div className="relative group w-[185px] h-[300px] perspective-1000 mx-auto font-inter">
      {/* Outer Glow for Active/Hover State */}
      <div
        className={`absolute -inset-[3px] rounded-2xl transition-all duration-300 z-0 ${
          isActive
            ? "opacity-100"
            : isSelected
            ? "opacity-50"
            : "opacity-0 group-hover:opacity-40"
        }`}
        style={{
          background: `linear-gradient(to top, ${borderColor}, transparent)`,
          boxShadow: isActive ? `0 0 20px ${borderColor}60` : "none"
        }}
      />

      {/* Floating Equipped Capsule (Detached & Glowing) */}
      {isActive && (
        <div 
          className="absolute -top-9 left-1/2 -translate-x-1/2 z-50 px-5 py-1.5 rounded-full text-white/90 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border backdrop-blur-md flex items-center justify-center whitespace-nowrap"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            borderColor: borderColor,
            boxShadow: `0 0 20px ${borderColor}50, inset 0 0 10px ${borderColor}30`,
            color: borderColor
          }}
        >
          Equipped
        </div>
      )}

      <div
        className={`relative w-full h-full duration-700 transition-all transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div
          className={`absolute inset-0 backface-hidden rounded-[14px] flex flex-col items-center justify-end overflow-hidden z-10 transition-all duration-300 backdrop-blur-[12px]
            ${locked ? "opacity-90" : ""}
          `}
          style={{
            backgroundColor: "rgba(13, 13, 18, 0.35)",
            border: `2px solid ${isActive ? borderColor : borderColor + "40"}`,
            boxShadow: `inset 0 0 30px ${borderColor}25`
          }}
        >
          {/* SVG Background Pattern Injection */}
          <div 
            className="absolute inset-0 z-0 opacity-100 transition-transform duration-1000 group-hover:scale-105 pointer-events-none mix-blend-screen"
            style={{
              backgroundImage: bgPattern,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Vignette Shadow to pop character */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t z-10 from-black/90 via-black/40 to-transparent pointer-events-none" />
          <div className={`absolute inset-0 bg-linear-to-b opacity-30 z-10 ${theme.glow} pointer-events-none mix-blend-overlay`} />

          {/* Character Image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-6">
            <motion.img
              src={character.image}
              alt={character.name}
              className="max-h-[60%] max-w-[125%] object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-110"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Locked Hover Message */}
          {locked && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-sm pointer-events-none rounded-[14px]">
               <div className="bg-black/90 text-neutral-100 text-[9px] font-black uppercase tracking-[0.1em] px-4 py-3 rounded-lg border border-red-500/30 shadow-2xl text-center w-[85%] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 <Lock className="w-4 h-4 mx-auto mb-1.5 text-red-400" />
                 Unlocks at <br/> higher levels
               </div>
            </div>
          )}

          {/* Character Name Header */}
          <div className="absolute top-5 left-0 right-0 text-center z-40 pointer-events-none drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black tracking-tighter text-white/95 uppercase font-serif" style={{ textShadow: "0 2px 8px rgba(0,0,0,1)" }}>
              {character.name}
            </h2>
          </div>

          {/* Interaction Area (Bottom) - Restored Dual Buttons */}
          <div className="relative z-30 w-full px-3 pb-4 pt-0">
            <div className="flex gap-2 relative z-20">
              <button
                onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                className="flex-1 py-2 rounded-md bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-black uppercase tracking-wider shadow border transition-all hover:bg-black/80 hover:scale-105 flex items-center justify-center gap-1.5"
                style={{ borderColor: `${borderColor}40` }}
              >
                <Swords className="w-3 h-3 text-white/60" /> Powers
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); if(!locked && !isActive) onSelect(); }}
                disabled={locked || isActive}
                className={`flex-1 py-2 rounded-md font-black text-[10px] uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 shadow ${
                  isActive 
                    ? 'bg-transparent text-white/50 cursor-not-allowed border-white/10'
                    : locked
                      ? 'bg-black/80 border-red-900/50 text-neutral-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-neutral-200 hover:scale-105 border-white'
                }`}
                style={!locked && !isActive ? { backgroundColor: borderColor, borderColor: borderColor, color: '#000' } : {}}
              >
                {locked ? <Lock className="w-3 h-3 text-red-500" /> : isActive ? 'Active' : 'Equip'}
              </button>
            </div>
          </div>
        </div>



        {/* BACK SIDE */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[14px] border bg-neutral-900/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col z-10 ${
            isFlipped ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ borderColor: borderColor + "50" }}
        >
          <div className="p-3 border-b border-white/5 flex items-center justify-between" style={{ backgroundColor: borderColor + "20" }}>
            <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
              <Zap className="w-3 h-3" style={{ color: borderColor }} /> Abilities
            </h3>
            <button onClick={() => setIsFlipped(false)} className="text-white/50 hover:text-white transition-colors p-1 bg-black/20 rounded-md">
              <Undo2 className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 p-3 flex flex-col space-y-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <p className="text-[10px] text-neutral-400 italic border-l-2 pl-2" style={{ borderLeftColor: borderColor }}>
              "{character.description}"
            </p>
            <div className="space-y-2 mt-2">
              {Object.entries(character.Power).map(([name, desc], idx) => (
                <div key={idx} className="p-2 rounded-lg bg-black/40 border border-transparent hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="p-1 rounded text-white" style={{ backgroundColor: borderColor + "40" }}>
                      {idx === 0 ? <Zap className="w-2.5 h-2.5" /> : idx === 1 ? <ShieldCheck className="w-2.5 h-2.5" /> : <Palette className="w-2.5 h-2.5" />}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-neutral-100">{name}</span>
                  </div>
                  <p className="text-[9px] text-neutral-400 pl-6 leading-relaxed bg-transparent">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-2 border-t border-white/10 flex justify-center bg-black/40">
            <button
              onClick={() => setIsFlipped(false)}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5"
            >
              Return
            </button>
          </div>
        </div>
      </div>

      {/* Character title — outside the flipper so it never rotates */}
      <div
        className={`absolute -bottom-6 left-0 right-0 text-center z-50 pointer-events-none transition-opacity duration-300 ${
          isFlipped ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-[9px] font-black uppercase tracking-widest drop-shadow-lg" style={{ color: borderColor }}>
          {character.title}
        </p>
      </div>
    </div>
  );
}
