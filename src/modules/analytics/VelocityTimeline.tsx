"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VelocityTimelineProps {
  velocity: {
    joinedWithin1h: number;
    joinedWithin6h: number;
    joinedWithin24h: number;
    joinedAfter24h: number;
  };
}

const chartConfig = {
  count: {
    label: "Hunters",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const PREMIUM_COLORS = [
  "#E7F5DC", // Flash (<1h)
  "#CFE1B9", // Rapid (<6h)
  "#B6C99B", // Steady (<24h)
  "#98A77C", // Late (>24h)
];

export const VelocityTimeline = ({ velocity }: VelocityTimelineProps) => {
  const data = [
    { name: "Flash", count: velocity.joinedWithin1h, label: "< 1h", description: "Instant Interest", color: PREMIUM_COLORS[0] },
    { name: "Rapid", count: velocity.joinedWithin6h, label: "< 6h", description: "Fast Action", color: PREMIUM_COLORS[1] },
    { name: "Steady", count: velocity.joinedWithin24h, label: "< 24h", description: "Steady Growth", color: PREMIUM_COLORS[2] },
    { name: "Late", count: velocity.joinedAfter24h, label: "> 24h", description: "Ongoing Interest", color: PREMIUM_COLORS[3] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative group p-6 rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-[#0A0E17] backdrop-blur-3xl overflow-hidden",
        "flex flex-col h-full shadow-2xl"
      )}
    >
      {/* Background Decorative Element */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/5 blur-[40px] group-hover:bg-primary/10 transition-all rounded-full" />
      
      <div className="w-full flex items-center justify-between mb-4 relative z-10">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
          Interest Activity
        </h4>
        <div className="px-1.5 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-[8px] font-black text-green-400 uppercase tracking-widest">
           Flow
        </div>
      </div>

      <div className="w-full h-[180px] relative z-10">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontWeight: 700 }}
              dy={5}
            />
            <YAxis 
               tickLine={false} 
               axisLine={false} 
               tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} 
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255,255,255,0.03)", radius: 10 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 2, 2]}
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell 
                   key={`cell-${index}`} 
                   fill={entry.color}
                   className="hover:opacity-80 transition-opacity duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 relative z-10">
         {data.slice(0, 2).map((item, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
               <div className="flex items-center gap-2 mb-1">
                  <div 
                     className="w-1.5 h-1.5 rounded-full" 
                     style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}66` }}
                  />
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">{item.name}</p>
               </div>
               <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-black italic text-white leading-none">{item.count}</span>
                  <span className="text-[9px] font-bold text-white/20">{item.description}</span>
               </div>
            </div>
         ))}
      </div>

      {/* Hover Light Sweep Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </motion.div>
  );
};
