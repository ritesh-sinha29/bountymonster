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

/**
 * Grid-based character selection interface allowing users to
 * browse available characters, preview powers, and equip characters
 * representing their user profile. Trigger corresponding theme updates.
 */
export function CharacterSelector() {
  const currentCharacter = useQuery(api.characters.getCurrentCharacter);
  const changeCharacter = useMutation(api.characters.changeCharacter);
  const [changing, setChanging] = useState<number | null>(null);

  const handleSelect = async (char: (typeof Characters)[0]) => {
    if (char.type === "locked") return;
    if (char.name === currentCharacter?.characterName) return;

    setChanging(char.id);
    try {
      await changeCharacter({
        characterName: char.name,
        theme: char.theme,
        userAvatar: char.image,
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
    <div className="min-h-full w-full pb-16">
      {/* Header */}
      <div className="px-6 pt-8 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4"
        >
          <Sparkles className="w-3 h-3" /> Choose Your Fighter
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black italic uppercase tracking-tighter text-white"
        >
          Characters
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-white/40 mt-2"
        >
          Switch your character anytime. Locked characters unlock at higher levels.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {Characters.map((char, idx) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.07 }}
            className="relative"
          >
            {changing === char.id && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            <CharacterSelectCard
              character={char}
              isActive={currentCharacter?.characterName === char.name}
              isSelected={false}
              onSelect={() => handleSelect(char)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
