"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type PlanType = "pro" | "elite" | null;

interface Plan {
  name: string;
  planType: PlanType;
  priceUSD: number;
}

export const useRazorpay = () => {
  const { user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState(85); // fallback if fetch fails
  const updateUserPlan = useMutation(api.payments.updateUserPlan);
  const router = useRouter();

  /**
   * Fetch live USD→INR rate on mount. 
   * Falls back to hardcoded 85 if API is down to prevent payment blocks.
   */
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data.rates?.INR) setExchangeRate(data.rates.INR);
      } catch {
        /** Silently fall back to default rate if fetch network fails */
      }
    };
    fetchRate();
  }, []);

  const initiatePayment = async (plan: Plan) => {
    if (!user) {
      toast.error("Please sign in to upgrade your plan");
      return;
    }

    /**
     * Guard: Razorpay script must be explicitly loaded via <Script> 
     * before calling new window.Razorpay().
     */
    if (typeof window.Razorpay === "undefined") {
      toast.error("Payment system is loading, please try again.");
      return;
    }

    setLoadingPlan(plan.name);

    try {
      /**
       * Payment branching logic:
       * Pro plan uses subscriptions (recurring cycle).
       * All other premium plans use one-time standard orders.
       */
      const isSubscription = plan.planType === "pro";
      const apiUrl = isSubscription
        ? "/api/payments/razorpay/subscription"
        : "/api/payments/razorpay/order";

      const orderRes = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.priceUSD * exchangeRate, // convert USD → INR at live rate
          currency: "INR",
          planName: plan.name,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order/subscription");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        /**
         * Parameters map differently depending on payment mode:
         * amount/currency/order_id apply exclusively to one-time orders.
         * subscription_id applies exclusively to subscriptions.
         */
        amount: isSubscription ? undefined : orderData.amount,
        currency: isSubscription ? undefined : orderData.currency,
        order_id: isSubscription ? undefined : orderData.orderId,
        subscription_id: isSubscription ? orderData.subscriptionId : undefined,
        name: "Bounty Monster",
        image: `${window.location.origin}/logo.svg`,
        description: `Upgrade to ${plan.name}`,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (plan.planType) {
                await updateUserPlan({
                  planType: plan.planType as "pro" | "elite",
                  /**
                   * Persist the subscription ID so the backend can programmatically 
                   * trigger cancellations via Razorpay API if the user downgrades.
                   */
                  subscriptionId: response.razorpay_subscription_id ?? undefined,
                });
                toast.success(`Successfully upgraded to ${plan.name}!`);
                router.push("/home");
              }
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("[Razorpay] Verification error:", err);
            toast.error("An error occurred during payment verification.");
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#05070B" },
        modal: {
          ondismiss: function() {
            document.body.style.overflow = "auto";
            toast.info("Payment cancelled");
            setLoadingPlan(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        document.body.style.overflow = "auto";
        toast.error("Payment failed: " + response.error.description);
        setLoadingPlan(null);
      });
      rzp.open();

    } catch (error: any) {
      console.error("[Razorpay] Payment initiation error:", error);
      toast.error(error.message || "An error occurred while initiating payment.");
      setLoadingPlan(null);
    }
  };

  return { initiatePayment, loadingPlan, exchangeRate, setLoadingPlan };
};
