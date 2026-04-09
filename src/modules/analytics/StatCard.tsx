"use client";

import { motion } from "framer-motion";
import { 
  UsersRound, 
  Target, 
  Flame, 
  Trophy,
} from "lucide-react";
import { 
  Line as ReLine, 
  LineChart as ReLineChart, 
  Bar as ReBar, 
  BarChart as ReBarChart, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  chartData?: any[];
  visualType?: "sparkline" | "bar" | "dots";
  className?: string;
  delay?: number;
  color?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  chartData,
  visualType = "sparkline",
  className,
  delay = 0,
  color = "primary",
}: StatCardProps) => {
  const visualColor = color === "primary" ? "#F97316" : color;
  const visualColorMuted = `${visualColor}33`;

  const getVisual = () => {
    if (!chartData || chartData.length === 0) return null;

    if (visualType === "sparkline") {
      return (
        <div className="h-10 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={chartData}>
              <ReLine 
                type="monotone" 
                dataKey="value" 
                stroke="var(--visual-color)" 
                strokeWidth={2} 
                dot={false} 
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (visualType === "bar") {
      return (
        <div className="h-10 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={chartData}>
              <ReBar dataKey="value" radius={[2, 2, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell 
                     key={`cell-${index}`} 
                     fill={index === chartData.length - 1 ? "var(--visual-color)" : "var(--visual-color-muted)"} 
                  />
                ))}
              </ReBar>
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (visualType === "dots") {
       return (
          <div className="flex gap-1.5 items-center">
             {[1, 2, 3, 4].map((i) => (
                <div 
                   key={i} 
                   className={cn(
                      "w-4 h-4 rounded-full border-2",
                      i <= (Number(chartData[0]?.value) || 0) 
                         ? "bg-primary border-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
                         : "bg-transparent border-white/10"
                   )}
                />
             ))}
          </div>
       )
    }

    return null;
  };

   const getIcon = () => {
     switch (title) {
       case "Total Joined": return UsersRound;
       case "Active Hunters": return Target;
       case "Flash Joiners": return Flame;
       case "Conversion Rate": return Trophy;
       default: return Target;
     }
   };

   const CardIcon = getIcon();

   return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay 
      }}
      whileHover={{ y: -5, scale: 1.01 }}
      style={{ 
        "--visual-color": visualColor,
        "--visual-color-muted": visualColorMuted 
      } as React.CSSProperties}
      className={cn(
        "relative overflow-hidden group p-6 rounded-[1.5rem] border border-white/[0.08] bg-[#0A0E17] transition-all duration-500 shadow-2xl",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.03] before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity",
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Header Section */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-white/60 group-hover:text-primary transition-colors">
                 <CardIcon className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                {title}
              </h4>
           </div>

         </div>

        {/* Value row */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
             <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
               {value}
             </h3>
             {subtitle && (
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                 {subtitle}
               </p>
             )}
          </div>

          <div className="pb-1 transition-transform group-hover:scale-110 duration-500">
             {getVisual()}
          </div>
        </div>
      </div>

      {/* Hover Light Sweep Effect */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />
    </motion.div>
  );
};
