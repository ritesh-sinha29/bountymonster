"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CancelSubscriptionPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isCanceling, setIsCanceling] = useState(false);
  const [hasCanceled, setHasCanceled] = useState(false);

  // Fetch the subscription to check if they have one to cancel
  const subscription = useQuery(api.subscriptions.getByClerkId, {
    clerkId: user?.id || "",
  });

  const handleCancel = async () => {
    try {
      setIsCanceling(true);

      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel subscription");
      }

      setHasCanceled(true);
      toast.success("Subscription canceled successfully.");
    } catch (error) {
      toast.error("Something went wrong. Please try again or contact support.");
    } finally {
      setIsCanceling(false);
    }
  };

  if (subscription === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (subscription === null || subscription.status !== "active") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto p-6 text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-black italic tracking-tighter text-white mb-4">No Active Subscription</h1>
        <p className="text-gray-400 mb-8">
          You don't have an active subscription to cancel.
        </p>
        <button
          onClick={() => router.push("/subscription")}
          className="bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white px-6 py-3 rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </button>
      </div>
    );
  }

  if (hasCanceled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto p-6 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-black italic tracking-tighter text-white mb-4">Subscription Canceled</h1>
        <p className="text-gray-400 mb-8">
          Your subscription has been set to cancel at the end of your billing cycle. You will not be charged again.
        </p>
        <button
          onClick={() => router.push("/home")}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-colors font-medium"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col justify-center">
      <div className="bg-[#111625] border border-red-500/20 rounded-[28px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient red glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-red-600/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
          
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white mb-4">
            Cancel Subscription?
          </h1>
          
          <p className="text-[15px] text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
            We're sorry to see you go! If you cancel now, you'll still have full access to your Pro features until the end of your current billing period.
          </p>

          <div className="bg-[#1a1626] border border-white/5 rounded-2xl p-6 w-full mb-10 text-left">
            <h3 className="text-white font-bold mb-3">You will lose access to:</h3>
            <ul className="space-y-3">
              {[
                "Unlimited active bounties",
                "Advanced AI-based hunting tools",
                "Personalized insights and guidance"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-[14px] text-gray-400">
                  <span className="mr-3 text-red-500 font-bold">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => router.back()}
              disabled={isCanceling}
              className="bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white px-6 py-3.5 rounded-xl transition-colors font-medium flex-1 disabled:opacity-50"
            >
              Keep Subscription
            </button>
            <button
              onClick={handleCancel}
              disabled={isCanceling}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3.5 rounded-xl transition-colors font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
