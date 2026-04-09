"use client";

import React from "react";
import { Zap } from "lucide-react";

export function BoostInfo() {
  return (
    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-4">
      <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-bold text-white uppercase tracking-tight">
          Premium Highlighting
        </p>
        <p className="text-xs text-white/50">
          Boosted bounties appear in the featured carousel on the home
          page and receive a special "Boosted" badge on their card.
        </p>
      </div>
    </div>
  );
}
