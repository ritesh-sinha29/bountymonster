"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PricingCards } from "@/modules/subscription/components/PricingCards";
import { AlertCircle, CreditCard, ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SubscriptionPage() {
  const { user } = useUser();
  const subscription = useQuery(api.subscriptions.getByClerkId, {
    clerkId: user?.id || "",
  });

  return (
    <div className="min-h-screen w-full bg-background font-inter pb-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Active plan banner */}
        {subscription === undefined ? (
          <div className="mb-12 flex justify-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : subscription?.status === "active" ? (
          <div className="mb-16 bg-[#1a1626]/80 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <CheckCircle2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  Pro Hunter Plan <span className="text-[10px] uppercase font-black tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">Active</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
              <a 
                href="/api/portal"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white px-5 py-2.5 rounded-xl border border-white/5 transition-colors text-sm font-medium"
              >
                <CreditCard className="w-4 h-4 text-gray-400" />
                Manage Billing
              </a>
              <Link
                href="/subscription/cancel"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 px-5 py-2.5 rounded-xl transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
              >
                Cancel Plan
              </Link>
            </div>
          </div>
        ) : null}

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Level Up Your <span className="text-primary">Hunting</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Choose the best plan for you and your guild. Get access to exclusive bounties, advanced tools, and market insights.
          </p>
        </div>
        
        <PricingCards activePriceId={subscription?.status === "active" ? subscription.priceId : undefined} />
      </div>
    </div>
  );
}

