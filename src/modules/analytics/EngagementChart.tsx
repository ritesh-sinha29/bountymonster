"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EngagementChartProps {
  totalJoined: number;
  totalSubmitted: number;
}

const chartConfig = {
  submitted: {
    label: "Submitted",
    color: "var(--primary)",
  },
  joined: {
    label: "Only Joined",
    color: "rgba(255, 255, 255, 0.03)",
  },
} satisfies ChartConfig;

export const EngagementChart = ({
  totalJoined,
  totalSubmitted,
}: EngagementChartProps) => {
  const onlyJoined = Math.max(0, totalJoined - totalSubmitted);
  
  const data = [
    { name: "submitted", value: totalSubmitted, fill: "var(--color-submitted)" },
    { name: "joined", value: onlyJoined, fill: "var(--color-joined)" },
  ];

  const percentage = totalJoined > 0 
    ? Math.round((totalSubmitted / totalJoined) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative group p-6 rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-[#0A0E17] backdrop-blur-3xl overflow-hidden",
        "flex flex-col items-center justify-center shadow-2xl"
      )}
    >
      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 blur-[40px] group-hover:bg-primary/10 transition-all rounded-full" />
      
      <div className="w-full flex items-center justify-between mb-4 relative z-10">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
          Engagement Ratio
        </h4>
        <div className="px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-widest">
           Live
        </div>
      </div>

      <div className="w-full h-[180px] relative z-10">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={75}
              strokeWidth={1}
              stroke="rgba(0,0,0,0.1)"
              paddingAngle={6}
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell 
                   key={`cell-${index}`} 
                   fill={entry.fill} 
                   className="transition-all duration-500 hover:opacity-80"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5, duration: 0.8 }}
             className="text-3xl font-black italic text-white tracking-tighter"
          >
            {percentage}%
          </motion.span>
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">
            Retention
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full mt-4 relative z-10">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(var(--primary-rgb),0.5)]" />
             <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Submitted</span>
          </div>
          <span className="text-xs font-black italic text-white">{totalSubmitted}</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
             <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Joined Only</span>
          </div>
          <span className="text-xs font-black italic text-white">{onlyJoined}</span>
        </div>
      </div>

      {/* Hover Light Sweep Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </motion.div>
  );
};
