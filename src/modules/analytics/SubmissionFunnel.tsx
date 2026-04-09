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

interface SubmissionFunnelProps {
  quality: {
    approved: number;
    rejected: number;
    pending: number;
  };
}

const chartConfig = {
  approved: {
    label: "Approved",
    color: "#22c55e",
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
  },
  pending: {
    label: "Pending",
    color: "#eab308",
  },
} satisfies ChartConfig;

export const SubmissionFunnel = ({ quality }: SubmissionFunnelProps) => {
  const data = [
    { name: "approved", value: quality.approved, fill: chartConfig.approved.color },
    { name: "rejected", value: quality.rejected, fill: chartConfig.rejected.color },
    { name: "pending", value: quality.pending, fill: chartConfig.pending.color },
  ].filter(d => d.value > 0);

  // If no data, show a placeholder
  const hasData = data.length > 0;
  const displayData = hasData ? data : [{ name: "empty", value: 1, fill: "rgba(255,255,255,0.05)" }];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative group p-6 rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-[#0A0E17] backdrop-blur-3xl overflow-hidden",
        "flex flex-col items-center justify-center shadow-2xl h-full"
      )}
    >
      {/* Background Decorative Element */}
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/5 blur-[40px] group-hover:bg-primary/10 transition-all rounded-full" />
      
      <div className="w-full flex items-center justify-between mb-4 relative z-10">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
          Submission Quality
        </h4>
        <div className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-widest">
           Shield
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
              data={displayData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={75}
              strokeWidth={1}
              stroke="rgba(0,0,0,0.1)"
              paddingAngle={hasData ? 4 : 0}
              startAngle={90}
              endAngle={450}
            >
              {displayData.map((entry, index) => (
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
            {quality.approved + quality.rejected + quality.pending}
          </motion.span>
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.15em]">
            Total Slips
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 w-full mt-4 relative z-10">
        <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
           <div className="w-1 h-1 rounded-full bg-green-500 mb-1.5 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
           <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-0.5">Approved</span>
           <span className="text-xs font-black italic text-white leading-none">{quality.approved}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
           <div className="w-1 h-1 rounded-full bg-yellow-500 mb-1.5 shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
           <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-0.5">Pending</span>
           <span className="text-xs font-black italic text-white leading-none">{quality.pending}</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
           <div className="w-1 h-1 rounded-full bg-red-500 mb-1.5 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
           <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-0.5">Rejected</span>
           <span className="text-xs font-black italic text-white leading-none">{quality.rejected}</span>
        </div>
      </div>

      {/* Hover Light Sweep Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </motion.div>
  );
};
