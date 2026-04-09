"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Characters } from "@/lib/Character";
import { CharacterSelectCard } from "./CharacterSelectCard";
import { applyCharacterTheme, CharacterTheme } from "@/lib/themes";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";


export function CharacterSelector() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const currentCharacter = useQuery(api.characters.getCurrentCharacter);
  const changeCharacter = useMutation(api.characters.changeCharacter);
  const [changing, setChanging] = useState<number | null>(null);

  if (currentUser === undefined || currentCharacter === undefined) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPro = currentUser?.planType === "pro" || currentUser?.planType === "elite";

  const handleSelect = async (char: (typeof Characters)[0]) => {
    // Determine if this character is locked for the current user
    const isLocked = !isPro && char.name !== currentCharacter?.characterName;
    
    if (isLocked) {
      toast.error("Upgrade to Pro to unlock all characters!");
      return;
    }
    
    if (char.name === currentCharacter?.characterName) return;

    setChanging(char.id);
    try {
      await changeCharacter({
        characterName: char.name,
        theme: char.theme,
      });
      applyCharacterTheme(char.theme as CharacterTheme);
      toast.success(`Character changed to ${char.name}!`);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to change character");
    } finally {
      setChanging(null);
    }
  };

  return (
    <div className="relative h-full max-h-[100dvh] w-full pt-4 pb-4 overflow-hidden bg-black flex flex-col">
      {/* Custom Universe Background */}
      <div 
         className="absolute inset-0 z-0 pointer-events-none object-cover opacity-30"
         style={{
           backgroundImage: "url('/character-bg.jpg')",
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundRepeat: "no-repeat"
         }}
      />
      
      {/* Subtle Gradient Overlay to ensure text readability */}
      <div 
         className="absolute inset-x-0 top-0 h-32 z-0 opacity-50 pointer-events-none bg-linear-to-b from-black to-transparent"
      />

      {/* Header */}
      <div className="relative z-10 px-4 pt-6 pb-4 text-center shrink-0">
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 text-white/70" /> Choose Your Fighter
        </motion.div>
        <motion.h1
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1, duration: 0.5 }}
           className="text-3xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text font-serif"
           style={{
             backgroundImage: "linear-gradient(to bottom, #ffffff 0%, #a1a1aa 50%, #52525b 100%)",
             textShadow: "0 4px 20px rgba(255,255,255,0.2)"
           }}
        >
          Characters
        </motion.h1>
        <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="text-[10px] md:text-xs text-neutral-400 mt-2 tracking-wider uppercase drop-shadow-md max-w-md mx-auto"
        >
          {isPro 
            ? "Switch between any character anytime. All characters are unlocked with your Pro plan." 
            : "Upgrade to Pro to unlock all characters and switch between them anytime."}
        </motion.p>
      </div>

      {/* Single-line No-Scroll Character Row */}
      <div className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto overflow-hidden flex flex-col justify-center pb-8">
        {/* Transparent edge gradients removed since we shouldn't scroll anymore */}
        
        <div className="flex flex-nowrap items-center justify-center gap-2 md:gap-6 px-1 lg:px-4 shrink-0">
          {Characters.map((char, idx) => {
            const isCharLocked = !isPro && char.name !== currentCharacter?.characterName;
            
            return (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.07 }}
                className="relative shrink-0 snap-center"
              >
                {changing === char.id && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[14px] bg-black/60 backdrop-blur-md border border-primary/50">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
                <CharacterSelectCard
                  character={char}
                  isActive={currentCharacter?.characterName === char.name}
                  isLocked={isCharLocked}
                  isSelected={false}
                  onSelect={() => handleSelect(char)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
