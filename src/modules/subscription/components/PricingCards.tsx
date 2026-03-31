"use client";

import React from "react";
import { Check, Mail, User, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

/** ... skipping plan comments ... */
const plans = [
  {
    name: "Starter Hunter",
    description: "Essential hunting tools. Daily market insights. Secure platform.",
    price: "$10",
    interval: "/month",
    buttonText: "Choose this plan",
    polarPriceId: "cbbe9eef-e790-4cca-9238-dec6817d9666",
    features: [
      { icon: <User className="w-3.5 h-3.5" />, text: "2 team members" },
      { icon: <Cloud className="w-3.5 h-3.5" />, text: "20 active bounties" },
    ],
    checks: [
      "Basic analytics",
      "Community support",
      "Standard platform access",
    ],
    bgClass: "bg-gradient-to-b from-[#111625] to-[#0a0a0a]",
    glowClass: "bg-[#2563eb]",
    iconWrapper: "bg-[#18233e]",
    iconColor: "text-[#60a5fa]",
    buttonClass: "bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white/90 font-medium border border-white/5",
  },
  {
    name: "Pro Hunter",
    isPopular: true,
    description: "Supercharged hunting tools. Personalized guidance. Early access bounties.",
    price: "$25",
    interval: "/month",
    buttonText: "Choose this plan",
    polarPriceId: "dc14db88-2302-4137-9ad2-db1f022f6643", // ← Paste your Polar Price ID here
    buttonClass: "bg-[#fe5b22] hover:bg-[#ff6a38] text-white font-semibold shadow-[0_4px_14px_0_rgba(254,91,34,0.39)]",
    features: [
      { icon: <User className="w-3.5 h-3.5" />, text: "5 team members" },
      { icon: <Cloud className="w-3.5 h-3.5" />, text: "Unlimited active bounties" },
    ],
    includes: "Starter Hunter +",
    checks: [
      { text: "Supercharged tools", badge: "AI-based" },
      { text: "Personalized guidance" },
      { text: "Market insights" },
    ],
    bgClass: "bg-gradient-to-b from-[#1a1626] to-[#0a0a0a]",
    glowClass: "bg-[#9333ea]",
    iconWrapper: "bg-[#2b1f41]",
    iconColor: "text-[#c084fc]",
  },
  {
    name: "Guild Master",
    description: "Own your guild network. Custom integrations. Dedicated support.",
    price: "Contact us",
    buttonText: "Contact us",
    polarPriceId: null as string | null, // Enterprise — keep null (uses mailto link)
    buttonIcon: <Mail className="w-4 h-4 mr-2" />,
    buttonClass: "bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white/90 font-medium border border-white/5",
    features: [
      { icon: <User className="w-3.5 h-3.5" />, text: "Unlimited team members" },
      { icon: <Cloud className="w-3.5 h-3.5" />, text: "Custom active bounties" },
    ],
    includes: "Pro Hunter +",
    checks: [
      "Custom integrations",
      "Dedicated support team",
      "Exclusive enterprise bounties",
    ],
    bgClass: "bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]",
    glowClass: "bg-[#52525b]",
    iconWrapper: "bg-[#27272a]",
    iconColor: "text-[#a1a1aa]",
  },
];

export const PricingCards = ({ activePriceId }: { activePriceId?: string }) => {
  const { user } = useUser();
  const externalIdParam = user?.id ? `&customerExternalId=${user.id}` : "";

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 p-6 w-full py-10 relative font-sans perspective-[2000px]">
      
      {/* Faint subtle top ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white opacity-[0.015] blur-[100px] pointer-events-none -z-40" />

      {plans.map((plan, i) => {
        const isMiddle = i === 1;
        const isCurrentPlan = activePriceId && plan.polarPriceId === activePriceId;

        // Build the button href:
        // - If polarPriceId is set → Polar checkout
        // - If "Contact us" → mailto link
        // - Otherwise → disabled (price not yet configured)
        const href = plan.polarPriceId
          ? `/api/checkout?products=${plan.polarPriceId}${externalIdParam}`
          : plan.price === "Contact us"
          ? "mailto:hello@bountymonster.gg"
          : null;

        return (
          <div

            key={plan.name}
            className={cn(
              "relative flex flex-col p-10 rounded-[28px] w-full max-w-[380px] border border-white/[0.04] transition-all duration-500",
              plan.bgClass,
              isMiddle 
                ? "z-20 lg:scale-[1.08] opacity-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                : "z-10 lg:scale-[0.92] opacity-50 hover:opacity-100 hover:scale-[0.94] cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
            )}
          >
            {/* Background elements wrapper */}
            <div className="absolute inset-0 rounded-[28px] overflow-hidden -z-20 pointer-events-none">
              <div 
                className={cn("absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-[200px] blur-[70px] -z-10 opacity-30 rounded-full select-none pointer-events-none", plan.glowClass)} 
              />
              <div className="absolute top-2 -right-8 -z-10 opacity-[0.02] pointer-events-none select-none flex items-start justify-end">
                <span className="text-[200px] font-black leading-none tracking-tighter mix-blend-overlay italic block -rotate-12 translate-x-4 -translate-y-8">
                  {isMiddle ? "JS" : i === 0 ? "J<" : "JS"}
                </span>
              </div>
            </div>

            {/* Most Popular Badge */}
            {plan.isPopular && (
              <div className="absolute -top-3.5 right-8 bg-[#1f1b2e] border border-white/10 text-white/90 text-xs px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md z-20 font-medium tracking-wide">
                Most popular
              </div>
            )}

            {/* Icon */}
            <div className={cn("w-[42px] h-[42px] rounded-full flex items-center justify-center mb-6 relative shadow-inner", plan.iconWrapper)}>
              <div className={cn("w-[18px] h-[18px] rounded-full bg-current opacity-90 relative", plan.iconColor)} style={{ maskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0.2) 100%)', WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0.2) 100%)' }}>
                 <div className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full" />
              </div>
            </div>

            {/* Header Content */}
            <h3 className="text-[22px] font-bold text-white mb-2.5 tracking-tight">{plan.name}</h3>
            <p className="text-[13px] text-[#8e8e93] leading-[1.6] mb-8 pr-4 min-h-[42px]">
              {plan.description}
            </p>

            {/* Price section */}
            <div className="mb-7 flex items-end min-h-[50px]">
              {plan.price === "Contact us" ? (
                <span className="text-[34px] font-bold text-white tracking-[-0.03em] leading-none mb-1">
                  {plan.price}
                </span>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[46px] font-bold text-white tracking-[-0.04em] leading-none">
                    {plan.price}
                  </span>
                  <span className="text-[13px] text-[#8e8e93] font-medium mb-1.5">
                    {plan.interval}
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button — links to Polar checkout or mailto */}
            {isCurrentPlan ? (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-xl text-[14px] transition-all flex items-center justify-center mb-10 bg-white/10 text-white font-medium border border-white/20 cursor-default"
              >
                Current Plan
              </button>
            ) : href ? (
              <a
                href={href}
                className={cn(
                  "w-full py-3.5 px-4 rounded-xl text-[14px] transition-all flex items-center justify-center mb-10",
                  plan.buttonClass
                )}
              >
                {"buttonIcon" in plan && plan.buttonIcon}
                {plan.buttonText}
              </a>
            ) : (
              <button
                disabled
                title="Price not yet configured — add your Polar Price ID"
                className={cn(
                  "w-full py-3.5 px-4 rounded-xl text-[14px] transition-all flex items-center justify-center mb-10 opacity-60 cursor-not-allowed",
                  plan.buttonClass
                )}
              >
                {plan.buttonText}
              </button>
            )}

            {/* Upper Features */}
            <div className="space-y-4 text-[13px]">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-3">
                  <span className="text-[#8e8e93] flex justify-center shrink-0">{feature.icon}</span>
                  <span className="text-[#d1d1d6]">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="my-7 font-sans">
              {"includes" in plan && plan.includes ? (
                <div className="flex items-center w-full group opacity-80">
                  <div className="h-px bg-white/[0.06] flex-1" />
                  <span className="px-4 text-[9px] font-bold tracking-[0.2em] text-[#636366] uppercase">
                    {plan.includes}
                  </span>
                  <div className="h-px bg-white/[0.06] flex-1" />
                </div>
              ) : (
                <div className="w-full h-px bg-white/[0.06]" />
              )}
            </div>

            {/* Lower Checks */}
            <div className="space-y-4 mt-auto">
              {plan.checks.map((check: string | { text: string; badge?: string }, j: number) => (
                <div key={j} className="flex items-center text-[13px]">
                  <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full border border-white/20 text-white/60 mr-3.5 shrink-0 bg-transparent">
                    <Check className="w-2.5 h-2.5 opacity-80" strokeWidth={3} />
                  </div>
                  <div className="flex items-center flex-wrap text-[#8e8e93]">
                    {typeof check === "string" ? check : check.text}
                    {typeof check === "object" && check.badge && (
                      <span className="ml-2.5 px-2 py-0.5 rounded border border-white/5 bg-white/[0.03] text-[10px] text-[#a1a1aa] shadow-inner flex items-center gap-1">
                        <span className="text-yellow-500 text-[8px]">✦</span> {check.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        );
      })}
    </div>
  );
};
