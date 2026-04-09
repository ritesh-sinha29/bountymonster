"use client";

import React from "react";
import { PricingCards } from "@/modules/subscription/components/PricingCards";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#050505] font-sans pb-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 py-12 mt-6">
        {/* Navigation & Header Row */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Back Button (Absolute Left) */}
          <button 
            onClick={() => router.push("/home")}
            className="absolute left-0 group flex items-center gap-2 text-gray-500 hover:text-primary transition-all duration-300 bg-white/5 hover:bg-primary/10 px-4 py-2 rounded-full border border-white/5 hover:border-primary/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>

          {/* Centered Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight italic">
              Level Up Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Hunting</span>
            </h1>
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-gray-500 max-w-xl mx-auto text-[16px] leading-relaxed">
            Choose the best plan for you. Get access to exclusive bounties, advanced tools, and market insights.
          </p>
        </div>
        
        <PricingCards />
      </div>
    </div>
  );
}
