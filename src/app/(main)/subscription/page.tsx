"use client";

import React from "react";
import { PricingCards } from "@/modules/subscription/components/PricingCards";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen w-full bg-background font-inter pb-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Level Up Your <span className="text-primary">Hunting</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Choose the best plan for you and your guild. Get access to exclusive bounties, advanced tools, and market insights.
          </p>
        </div>
        
        <PricingCards />
      </div>
    </div>
  );
}
