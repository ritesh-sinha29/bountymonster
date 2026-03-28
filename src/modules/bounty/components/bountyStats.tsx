"use client";

import { motion } from "framer-motion";

interface BountyStatsProps {
  bounties: any[];
}

export const BountyStats = ({ bounties }: BountyStatsProps) => {
  const totalBounties = bounties.length;
  const activeBounties = bounties.filter((b) => b.status === "active").length;
  const totalReward = bounties.reduce((acc, b) => acc + (b.reward || 0), 0);
  const totalHunters = new Set(
    bounties.flatMap((b) => b.hunters?.map((h: any) => h.id) || [])
  ).size;
  const totalViews = bounties.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalCompleted = bounties.filter((b) => b.status === "closed").length;

  const stats = [
    {
      label: "Total Bounties",
      value: totalBounties,
    },
    {
      label: "Active Now",
      value: activeBounties,
    },
    {
      label: "Total Rewards",
      value: `$${totalReward.toLocaleString()}`,
      extra: "Rank 12",
    },
    {
      label: "Hunters Joined",
      value: totalHunters,
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
    },
    {
      label: "Completed Bounties",
      value: totalCompleted,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="group relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden min-h-[100px] flex flex-col justify-end"
        >
          {/* Top glow effect mimicking the design */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10 flex flex-col items-start gap-1">
            <div className="flex items-end justify-between w-full">
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              {stat.extra && (
                <span className="text-xs font-medium text-muted-foreground mb-1">
                  {stat.extra}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground/70 font-medium">
              {stat.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
