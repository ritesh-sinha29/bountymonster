"use client";

import React from "react";
import { 
  CreditCard, 
  Loader2 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface OrderSummaryProps {
  days: number;
  totalCost: number;
  costPerDay: number;
  isProcessing: boolean;
  onBoost: () => void;
}

export function OrderSummary({
  days,
  totalCost,
  costPerDay,
  isProcessing,
  onBoost,
}: OrderSummaryProps) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-3xl sticky top-6 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
            <span className="text-white/40">Daily Rate</span>
            <span className="font-mono">₹{costPerDay}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
            <span className="text-white/40">Total Days</span>
            <span className="font-mono">{days}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-black uppercase italic tracking-tighter">
              Total
            </span>
            <span className="text-2xl font-black text-primary font-mono">
              ₹{totalCost}
            </span>
          </div>
        </div>

        <Button
          className="w-full bg-primary hover:brightness-110 h-12 text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.3)] group relative overflow-hidden"
          onClick={onBoost}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay &amp; Boost
              <motion.div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </>
          )}
        </Button>

        <p className="text-[10px] text-center text-white/30 font-medium">
          Secure Payment via Razorpay
        </p>
      </CardContent>
    </Card>
  );
}
