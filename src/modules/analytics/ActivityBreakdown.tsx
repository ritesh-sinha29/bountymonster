"use client"

import * as React from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Search, ChevronRight } from "lucide-react"

interface ActivityBreakdownProps {
  stats: {
    submissions: number;
    approvals: number;
    rejected: number;
    joins: number;
  };
}

const chartConfig = {
  submissions: { label: "Submissions", color: "#3B82F6" },
  approvals: { label: "Approvals", color: "#F59E0B" },
  rejected: { label: "Rejected", color: "#EC4899" },
  joins: { label: "Joins", color: "#6366F1" },
} satisfies ChartConfig

export function ActivityBreakdown({ stats }: ActivityBreakdownProps) {
  const total = stats.submissions + stats.approvals + stats.rejected + stats.joins;
  
  const activityData = [
    { name: "Submissions", value: stats.submissions, color: "#3B82F6" },
    { name: "Approvals", value: stats.approvals, color: "#F59E0B" },
    { name: "Rejected", value: stats.rejected, color: "#EC4899" },
    { name: "Joins", value: stats.joins, color: "#6366F1" },
  ].filter(item => item.value > 0);

  // If no data, show a placeholder
  const displayData = activityData.length > 0 ? activityData : [{ name: "No Activity", value: 1, color: "rgba(255,255,255,0.05)" }];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className={cn(
        "relative group p-8 rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-[#0A0E17] backdrop-blur-3xl overflow-hidden",
        "flex flex-col h-full shadow-2xl"
      )}
    >
      {/* Background Decorative Element */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all rounded-full" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
              <Search className="w-4 h-4 text-white/40" />
           </div>
           <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Activity Breakdown</h3>
        </div>
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <ChevronRight className="w-4 h-4 text-white/40" />
        </div>
      </div>

      <div className="relative w-full aspect-square max-w-[240px] mx-auto z-10">
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
              innerRadius={70}
              outerRadius={95}
              paddingAngle={activityData.length > 1 ? 8 : 0}
              strokeWidth={0}
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="transition-all duration-500 hover:opacity-80"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
            Total Actions
          </span>
          <motion.span 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.5, duration: 0.8 }}
             className="text-5xl font-black italic text-white tracking-tighter"
          >
            {total}
          </motion.span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-10 relative z-10">
        {activityData.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
             <div 
               className="w-2.5 h-2.5 rounded-full shrink-0" 
               style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}66` }} 
             />
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.name}</span>
                <span className="text-sm font-black italic text-white">
                  {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                </span>
             </div>
          </div>
        ))}
        {activityData.length === 0 && (
          <p className="col-span-2 text-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
            No activity recorded yet
          </p>
        )}
      </div>

      {/* Hover Light Sweep Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </motion.div>
  )
}
