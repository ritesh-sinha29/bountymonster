import { Check, Mail, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { useRazorpay } from "../hooks/useRazorpay";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    name: "Hunter",
    category: "STARTER",
    price: "Free",
    priceUSD: 0,
    description: "Essential hunting tools. Daily market insights. Secure platform.",
    buttonText: "Current Plan",
    planType: "free" as const,
    checks: [
      "Access to Basic Bounties",
      "Standard Support",
      "Community Access",
      "Weekly Progress Reports",
    ],
    buttonClass: "bg-white shadow-lg shadow-white/10",
  },
  {
    name: "Pro Hunter",
    category: "PRO HUNTER",
    price: "$6",
    priceUSD: 6,
    interval: "/month",
    description: "Supercharged hunting tools. Personalized guidance. Early access bounties.",
    buttonText: "Upgrade Now",
    planType: "pro" as const,
    isPopular: true,
    checks: [
      "Priority Bounty Access",
      "24/7 Premium Support",
      "Advance Filtering Tools",
      "Custom Hunt Dashboard",
    ],
    buttonClass: "bg-white shadow-lg shadow-white/10",
  },
  {
    name: "Elite Hunter",
    category: "ELITE HUNTER",
    price: "Contact us",
    priceUSD: 0,
    description: "Own your guild network. Custom integrations. Dedicated support.",
    buttonText: "Contact Us",
    planType: "elite" as const,
    checks: [
      "Unlimited Hunts",
      "Dedicated Guild Manager",
      "Custom API Access",
      "Bulk Operation Tools",
    ],
    buttonClass: "bg-white shadow-lg shadow-white/10",
  },
];



export const PricingCards = () => {
  const { initiatePayment, loadingPlan, setLoadingPlan } = useRazorpay();
  const user = useQuery(api.users.getCurrentUser);
  const updateUserPlan = useMutation(api.payments.updateUserPlan);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const router = useRouter();

  const handleAction = async (plan: typeof plans[0]) => {
    const isFree = plan.price === "Free";
    const isEnterprise = plan.name === "Elite Hunter" || plan.price === "Contact us";

    if (isFree) {
      /**
       * If the user is already on a paid Pro plan and clicks Free, 
       * intercept the click and show the downgrade confirmation dialog.
       */
      if (user?.planType === "pro") {
        setShowDowngradeDialog(true);
        return;
      }
      router.push("/home");
      return;
    }
    /**
     * TODO: Replace [EMAIL_ADDRESS] with the official support/sales email.
     * Intercepts enterprise actions and launches the system mail client.
     */
    if (isEnterprise) {
      window.location.href = "mailto:[EMAIL_ADDRESS]?subject=Inquiry about Elite Hunter Plan";
      return;
    }

    await initiatePayment(plan as any);
  };

  const handleCancel = async () => {
    if (!user) return;
    
    setShowCancelDialog(false);
    setLoadingPlan("Pro Hunter");
    try {
      /**
       * Step 1: Programmatically cancel the active subscription on the Razorpay side.
       * Uses the stored `razorpaySubscriptionId` from the DB.
       */
      if (user.razorpaySubscriptionId) {
        const cancelRes = await fetch("/api/payments/razorpay/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId: user.razorpaySubscriptionId }),
        });
        if (!cancelRes.ok) {
          const data = await cancelRes.json();
          throw new Error(data.error || "Failed to cancel subscription on Razorpay");
        }
      }
      /**
       * Step 2: Downgrade the user's plan in the DB and clear the subscription ID.
       */
      await updateUserPlan({
        planType: "free",
        subscriptionId: undefined,
      });
      toast.success("Subscription cancelled successfully. You are now on the Free plan.");
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to cancel subscription. Please contact support.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative w-full py-10 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 p-6 w-full max-w-[1200px] mx-auto relative z-10 font-sans">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        
        {plans.map((plan) => {
          const isLoading = loadingPlan === plan.name;
          // Apply 'White' theme to Free and Elite cards, 'Primary' theme to the Pro card
          const isWhiteTheme = plan.name === "Elite Hunter" || plan.name === "Hunter";

          return (
            <div
              key={plan.name}
              onClick={() => handleAction(plan)}
              className={cn(
                "group relative flex flex-col p-8 rounded-[24px] w-full lg:w-[380px] min-h-[520px] transition-all duration-500 overflow-hidden border border-white/[0.08] hover:-translate-y-2",
                "bg-white/[0.02] backdrop-blur-[2px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                isWhiteTheme 
                  ? "hover:border-white/40 hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]" 
                  : "hover:border-primary/50 hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)]"
              )}
            >
              {/* Card-level onClick handles keyboard/tap; button inside has its own onClick with z-20 to take priority */}
              {/* Inner Card Glow on Hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10",
                isWhiteTheme ? "bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" : "bg-gradient-to-b from-primary/[0.08] via-transparent to-transparent"
              )} />
              
              {/* Category Pill */}
              <div className="mb-8">
                <span className={cn(
                  "px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[13px] text-gray-400 font-medium tracking-wide transition-all duration-500",
                  isWhiteTheme ? "group-hover:text-white group-hover:border-white/20" : "group-hover:text-primary group-hover:border-primary/20"
                )}>
                  {plan.category}
                </span>
              </div>

              {/* Price section */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[48px] font-bold text-white tracking-tight transition-colors duration-500">
                    {plan.price}
                  </span>
                  {plan.interval && (
                    <span className={cn(
                      "text-[14px] text-gray-400 font-medium transition-colors duration-500",
                      isWhiteTheme ? "group-hover:text-white/60" : "group-hover:text-primary/70"
                    )}>
                      {plan.interval}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[15px] text-gray-400 mb-10 leading-relaxed max-w-[280px] group-hover:text-gray-200 transition-colors duration-500">
                {plan.description}
              </p>

              {/* Features/Checks */}
              <div className="space-y-4 mb-12 flex-grow">
                {plan.checks.map((check, j) => (
                  <div key={j} className="flex items-start gap-3 text-[14px]">
                    <div className={cn(
                      "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500",
                      "text-gray-500",
                      isWhiteTheme 
                        ? "group-hover:text-white group-hover:border-white/50 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                        : "group-hover:text-primary group-hover:border-primary/50 group-hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                    )}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-gray-400 group-hover:text-gray-100 transition-colors duration-500 leading-tight">{check}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button — elite is never disabled so users can always contact us */}
              <button
                disabled={isLoading || (plan.planType === user?.planType && plan.planType !== "elite")}
                onClick={() => handleAction(plan as any)}
                className={cn(
                  "w-full py-2.5 px-5 rounded-xl text-[14px] transition-all flex items-center justify-center cursor-pointer disabled:opacity-80 font-bold duration-300",
                  "relative z-20",
                  "bg-white/5 border border-white/10 text-white",
                  !isLoading && [
                    "group-hover:text-black group-hover:border-transparent",
                    isWhiteTheme ? "group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "group-hover:bg-primary group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                  ]
                )}
              >
                <div className="flex items-center justify-center pointer-events-none">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2 text-black" />
                      <span className="text-black">Processing...</span>
                    </>
                  ) : (
                    <>
                      {plan.name === "Hunter" && user?.planType !== "pro" && <ChevronRight className="w-4 h-4 mr-1 transition-transform group-hover:translate-x-1" />}
                      {/* Label logic: if user is Pro → show "Current" on Pro card, "Free" on Free card; otherwise show "Current" on Free card */}
                      <span className="transition-colors duration-200">
                        {user?.planType === "pro" 
                          ? (plan.planType === "pro" ? "Current" : plan.planType === "free" ? "Free" : plan.buttonText)
                          : (plan.planType === "free" ? "Current" : plan.buttonText)}
                      </span>
                    </>
                  )}
                </div>
              </button>

              {/* Simple cancel text for Pro users on Pro card */}
              {plan.planType === "pro" && user?.planType === "pro" && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCancelDialog(true);
                    }}
                    className="text-[12px] text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest font-bold cursor-pointer bg-transparent border-none p-0"
                  >
                    Cancel Subscription
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Downgrade confirmation — shown when a Pro user clicks the Free plan card */}
      <Dialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <DialogContent className="bg-[#0A0C10] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Switch to Free Plan?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to go with the Free plan? You will lose access to Pro features.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setShowDowngradeDialog(false)}
              className="text-white hover:text-white/80 bg-transparent hover:bg-transparent border-none cursor-pointer font-medium text-sm px-4 py-2"
            >
              Keep Pro
            </button>
            <button
              onClick={async () => {
                setShowDowngradeDialog(false);
                await handleCancel();
              }}
              className="h-9 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-white/20 text-white cursor-pointer bg-transparent hover:bg-white/5 transition-none flex-shrink-0 relative overflow-hidden"
            >
              {loadingPlan === "Pro Hunter" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cancelling...
                </>
              ) : (
                "Yes, go Free"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-[#0A0C10] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Cancel Pro Subscription</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to cancel your Pro Hunter subscription? 
              You will immediately lose access to premium features and be moved to the Free plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button 
              onClick={() => setShowCancelDialog(false)}
              className="text-white hover:text-white/80 bg-transparent hover:bg-transparent border-none cursor-pointer font-medium text-sm px-4 py-2"
            >
              Keep Subscription
            </button>
            <button 
              onClick={handleCancel}
              className="h-9 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium border border-red-500/40 text-red-500 cursor-pointer bg-transparent hover:bg-transparent transition-none flex-shrink-0 relative overflow-hidden"
            >
              {loadingPlan === "Pro Hunter" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cancelling...
                </>
              ) : (
                "Cancel Anyway"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
