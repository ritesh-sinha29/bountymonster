"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface SubmissionTrendsProps {
  data: {
    day: number;
    count: number;
    date: string;
  }[];
}

const chartConfig = {
  count: {
    label: "Submissions",
    color: "#FFFFFF",
  },
} satisfies ChartConfig

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    const value = item.count
    return (
      <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 min-w-[180px] relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.date}</span>
          <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">+Real Time</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <span className="text-xl font-black text-gray-900 italic tracking-tighter">{value} Submissions</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
             <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (value / 10) * 100)}%` }} 
             />
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100" />
      </div>
    )
  }
  return null
}

export function SubmissionTrends({ data }: SubmissionTrendsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative group p-8 rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-[#0A0E17] backdrop-blur-3xl overflow-hidden",
        "flex flex-col h-full shadow-2xl"
      )}
    >
      {/* Background Decorative Element */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all rounded-full" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tight">Submission Trends</h3>
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">
            Real-time activity and completion trends for this bounty.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
              Live Feed
           </div>
        </div>
      </div>

      <div className="h-[300px] w-full relative z-10">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255,255,255,0.05)" 
            />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 700 }}
              dy={10}
              interval={4}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#FFFFFF" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              activeDot={{ 
                r: 6, 
                fill: "#fff", 
                stroke: "var(--color-count)", 
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Hover Light Sweep Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </motion.div>
  )
}
