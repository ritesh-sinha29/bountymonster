"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import {
  ChevronLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addDays, differenceInDays } from "date-fns";
import { useUser } from "@clerk/nextjs";

// Imported Modules
import { BoostSettings } from "@/modules/bounty/boost/BoostSettings";
import { OrderSummary } from "@/modules/bounty/boost/OrderSummary";
import { BoostInfo } from "@/modules/bounty/boost/BoostInfo";

const COST_PER_DAY_USD = 3; // $3 per day

export default function BoostBountyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const bountyId = params.id as Id<"bounties">;

  const bounty = useQuery(api.bounties.getBounty, { id: bountyId });
  const activateBoost = useMutation(api.bounties.activateBountyBoost);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 3));
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  /**
   * Fetch current exchange rate from USD to INR accurately.
   */
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data.rates?.INR) {
          setExchangeRate(data.rates.INR);
        } else {
          setExchangeRate(83.5);
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
        setExchangeRate(83.5);
      }
    };
    fetchRate();
  }, []);

  // Days is derived from the difference between end and start
  const days = Math.max(1, differenceInDays(endDate, startDate));
  
  // Calculations
  const costPerDayINR = exchangeRate ? Math.round(COST_PER_DAY_USD * exchangeRate) : 0;
  const totalCostINR = costPerDayINR * days;

  const handleBoost = async () => {
    if (!bounty || !exchangeRate) return;
    setIsProcessing(true);

    try {
      // ── Step 1: Create Razorpay order via existing API route ──────────────
      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalCostINR,
          currency: "INR",
          planName: `Boost: ${bounty.name} (${days}d)`,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Failed to create order");
      }

      const order = await orderRes.json();

      // ── Step 2: Open Razorpay checkout ────────────────────────────────────
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Bounty Monster",
        image: `${window.location.origin}/logo.svg`,
        description: `Boost "${bounty.name}" for ${days} day${days !== 1 ? "s" : ""}`,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            // ── Step 3: Verify via existing verify route ───────────────────
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json();
              throw new Error(err.error || "Payment verification failed");
            }

            // ── Step 4: Activate boost in Convex ──────────────────────────
            await activateBoost({
              bountyId,
              days,
              startDate: startDate.getTime(),
            });

            toast.success("🚀 Bounty successfully boosted!");
            router.push(`/home/bounty/${bountyId}`);
          } catch (err: any) {
            toast.error("Verification failed: " + err.message);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.fullName || (bounty as any).creatorName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#05070B" },
        modal: {
          ondismiss: function() {
            document.body.style.overflow = "auto";
            toast.info("Payment cancelled");
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        document.body.style.overflow = "auto";
        toast.error("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error("Could not initiate payment: " + err.message);
      setIsProcessing(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (bounty === undefined || exchangeRate === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bounty === null) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-xl font-bold uppercase tracking-tighter">
          Bounty not found
        </h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!bounty.isCreator) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <ShieldCheck className="h-12 w-12 text-destructive" />
        <h1 className="text-xl font-bold uppercase tracking-tighter text-center">
          Only the creator can{" "}
          <span className="text-primary italic">boost</span> this bounty
        </h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background p-6 font-inter">
      <div className="max-w-2xl mx-auto space-y-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-white/5 transition-colors group"
        >
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Bounty
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Boost Your <span className="text-primary">Bounty</span>
          </h1>
          <p className="text-white/40 font-medium">
            Feature your bounty to attract more hunters and faster results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <BoostSettings 
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            <BoostInfo />
          </div>

          <div className="md:col-span-2">
            <OrderSummary 
              days={days}
              totalCost={totalCostINR}
              costPerDay={costPerDayINR}
              isProcessing={isProcessing}
              onBoost={handleBoost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
