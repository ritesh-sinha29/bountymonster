"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  UsersRound, 
  Target,
  Flame,
  Trophy,
  BarChart3, 
  PieChart as PieChartIcon,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { StatCard } from "@/modules/analytics/StatCard";
import { EngagementChart } from "@/modules/analytics/EngagementChart";
import { VelocityTimeline } from "@/modules/analytics/VelocityTimeline";
import { SubmissionFunnel } from "@/modules/analytics/SubmissionFunnel";
import { SubmissionTrends } from "@/modules/analytics/SubmissionTrends";
import { ActivityBreakdown } from "@/modules/analytics/ActivityBreakdown";


export default function BountyAnalytics() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as Id<"bounties">;

  const metrics = useQuery(api.analytics.getBountyMetrics, { bountyId }) as any;

  if (metrics === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 px-6 pt-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <div className="flex items-center gap-3">
               <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                  <BarChart3 className="w-6 h-6" />
               </div>
               <div>
                  <h1 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
                    Analytical Dashboard
                  </h1>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-1">
                    Performance report for <span className="text-primary">{metrics.bountyName}</span>
                  </p>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] block mb-1">Status</span>
                <span className="text-xs font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live Sync
                </span>
            </div>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Joined"
            value={metrics.engagement.totalJoined}
            subtitle="Unique Hunters"
            visualType="bar"
            chartData={metrics.joinHistory.map((d: any) => ({ value: d.count }))}
            delay={0.1}
          />
          <StatCard
            title="Active Hunters"
            value={metrics.engagement.totalSubmitted}
            subtitle="At least one submission"
            visualType="sparkline"
            chartData={metrics.submissionHistory.map((d: any) => ({ value: d.count }))}
            delay={0.2}
          />
          <StatCard
            title="Flash Joiners"
            value={metrics.velocity.joinedWithin1h}
            subtitle="Joined within 1 hour"
            visualType="sparkline"
            color="#A855F7"
            chartData={metrics.joinHistory.slice(0, 10).map((d: any) => ({ value: d.count }))} 
            delay={0.3}
          />
          <StatCard
            title="Conversion Rate"
            value={`${Math.round(metrics.engagement.ratio)}%` }
            subtitle="Join-to-Submit Ratio"
            visualType="dots"
            chartData={[{ value: Math.ceil(metrics.engagement.ratio / 25) }]}
            delay={0.4}
          />
        </div>



        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-full">
            <EngagementChart 
              totalJoined={metrics.engagement.totalJoined}
              totalSubmitted={metrics.engagement.totalSubmitted}
            />
          </div>
          <div className="lg:col-span-1 h-full">
            <VelocityTimeline velocity={metrics.velocity} />
          </div>
          <div className="lg:col-span-1 h-full">
             <SubmissionFunnel quality={metrics.quality} />
          </div>
        </div>

        {/* New Detailed Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-full">
            <SubmissionTrends data={metrics.submissionHistory} />
          </div>
          <div className="lg:col-span-1 h-full">
            <ActivityBreakdown stats={metrics.detailedActivity} />
          </div>
        </div>

        {/* Premium Detail Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="p-6 rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-[#0A0E17] backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[50px] group-hover:bg-primary/10 transition-all rounded-full" />
                <div className="relative z-10">
                   <Timer className="w-5 h-5 text-primary" />
                   <h3 className="text-lg font-black italic text-white uppercase tracking-tight">Join Activity</h3>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fast Joins (0-6h)</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">
                        {metrics.velocity.joinedWithin1h + metrics.velocity.joinedWithin6h}
                      </span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Later Joins (24h+)</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">
                        {metrics.velocity.joinedAfter24h}
                      </span>
                   </div>
                   <p className="text-[10px] text-white/20 font-medium leading-relaxed mt-4">
                      This shows how quickly people are joining. Fast joins indicate strong interest and excitement from the community.
                   </p>
                </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="p-6 rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-[#0A0E17] backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[50px] group-hover:bg-primary/10 transition-all rounded-full" />
                <div className="relative z-10">
                   <BarChart3 className="w-5 h-5 text-primary" />
                   <h3 className="text-lg font-black italic text-white uppercase tracking-tight">Work Quality</h3>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Accepted Rate</span>
                      <span className="text-xl font-black text-green-400 italic tracking-tighter">
                        {metrics.quality.total > 0 ? Math.round((metrics.quality.approved / metrics.quality.total) * 100) : 0}%
                      </span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rejected Rate</span>
                      <span className="text-xl font-black text-red-400 italic tracking-tighter">
                        {metrics.quality.total > 0 ? Math.round((metrics.quality.rejected / metrics.quality.total) * 100) : 0}%
                      </span>
                   </div>
                   <p className="text-[10px] text-white/20 font-medium leading-relaxed mt-4">
                      If many submissions are being rejected, you might need to make your instructions clearer to help people submit better work.
                   </p>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
