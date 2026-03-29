"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Interface mapping the expected shape of fully hydrated bounty data
 * returned from the Convex backend or constructed in the Page components.
 */
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
}

/**
 * Props expected by the BountyCard visual component.
 */
interface BountyCardProps {
  bounty: ConnectedBounty;
  index: number;
}

/**
 * A highly interactive, dark-themed card component displaying key bounty details.
 * Implements hover reveal for images, framer-motion scaling, and precise layout grids.
 */
export const BountyCard = ({ bounty, index }: BountyCardProps) => {
  const router = useRouter();
  const currencySymbol = bounty.currency === "INR" ? "₹" : bounty.currency === "EUR" ? "€" : bounty.currency === "GBP" ? "£" : "$";
  const rewardDisplay = bounty.rewardPerHunter !== undefined ? bounty.rewardPerHunter : bounty.reward;

  return (
    <Link href={`/home/bounty/${bounty._id}`} className="block cursor-pointer" prefetch={true}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        onHoverStart={() => router.prefetch(`/home/bounty/${bounty._id}`)}
        className={`group relative rounded-xl border border-white/5 bg-[#05070B] overflow-hidden w-full h-[130px] sm:h-[140px] cursor-pointer shadow-lg`}
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[50%] h-full opacity-40 group-hover:opacity-60 transition-opacity duration-700">
            <img
              src={bounty.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"}
              alt={bounty.name}
              className="w-full h-full object-cover rounded-r-xl transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-3 sm:p-4 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start w-full">
            <div className="inline-flex items-center px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-[8px] sm:text-[9px] font-bold text-blue-400 uppercase tracking-[0.1em]">
              {bounty.type || "FEATURED BOUNTY"}
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <div className="text-[9px] sm:text-[10px] font-bold text-white/40 tracking-[0.1em] font-mono">
                {bounty.xpReward}XP
              </div>
              {bounty.reward != null && (
                <div className="text-[10px] sm:text-[11px] font-bold text-green-400/90 tracking-[0.05em] font-mono">
                  {currencySymbol}{bounty.reward}
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pr-6">
            <h2 className="text-base sm:text-lg font-black italic text-white uppercase tracking-tight leading-none mb-1.5 drop-shadow-lg group-hover:text-blue-50 transition-colors line-clamp-1">
              {bounty.name}
            </h2>
            <p className="text-[10px] sm:text-xs italic text-white/40 tracking-wide font-medium leading-[1.3] max-w-[90%] line-clamp-2">
              {bounty.description}
            </p>
          </div>

          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="h-1 w-4 sm:w-6 bg-[#0070F3] rounded-full shadow-[0_0_8px_rgba(0,112,243,0.8)]" />
            <div className="h-1 w-1.5 bg-white/20 rounded-full" />
            <div className="h-1 w-1.5 bg-white/20 rounded-full" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
