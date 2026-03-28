"use client";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import Image from "next/image";
import React from "react";
import { AnimatedGradientTextDemo } from "./TopGradient";
import HeroTypeWriter from "./TypeWriter";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Codesandbox, Crosshair, Quote } from "lucide-react";
import HeroAnimation from "./HeroAnimation";
import { SignInButton, SignUp, SignUpButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { AuroraText } from "@/components/ui/aurora-text";

const Hero = () => {
  return (
    <div className="min-h-screen w-full dark">
      <main className="flex grow relative pt-4 md:pt-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 w-full grid grid-cols-1 max-[1280px]:pt-14  min-[1280px]:grid-cols-[2.6fr_2fr] gap-16 lg:gap-20 place-items-center">
          {/* LEFT CONTENT */}
          <div className="flex flex-col space-y-5 min-[1280px]:-mt-10 max-[1280px]:items-center max-[1280px]:justify-center w-full">
            <div className="flex items-center justify-center gap-2 mb-14">
              <div className="py-2 px-8 border text-white sm:text-white/90 rounded-full border-indigo-600/60 sm:border-indigo-500/30 shadow-[inset_0_-8px_10px_#8fdfff1f] font-pop text-sm">
                Bounties are live | Hunt now{" "}
                <Crosshair className="ml-1 inline size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </div>
            </div>
            {/* Main text */}
            <div className="flex flex-col text-white w-full max-[1280px]:items-center max-[1280px]:justify-center text-center md:text-left">
              <h1 className="text-[40px] md:text-7xl font-semibold font-inter leading-[1.1] tracking-wide text-balance">
                Earn by{" "}
                <span className=" font-semibold font-inter text-white">
                  {/* <AuroraText>Doing</AuroraText> */}
                  Doing
                  <Codesandbox className="ml-2 sm:ml-4 size-12 sm:size-14 text-violet-500 bg-white/10 rounded-xl p-2 inline" />
                </span>
              </h1>

              <h1 className="text-[40px] md:text-7xl font-semibold font-inter leading-[1.1] tracking-wide text-balance">
                Grow by{" "}
                <span className="text-white font-semibold relative inline-block font-inter">
                  Playing{" "}
                  <svg
                    className="absolute w-full h-3 -bottom-5 left-0 text-yellow-400"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 2 Q 50 10 100 3"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="7 6"
                    />
                  </svg>
                </span>{" "}
                <span className="text-yellow-500">.</span>
              </h1>
            </div>

            <div className=" text-base sm:text-lg text-muted-foreground max-[1280px]:text-center max-[1280px]:max-w-xl italic font-pop h-20 mt-10 sm:mt-6 px-1 text-center sm:px-0">
              {/* <HeroTypeWriter /> */}
              <h3 className="text-white/90">
                <Quote className="text-yellow-500/50 size-5 inline mr-3 rotate-180" />
                Complete real-world tasks & Quests, earn XP, unlock powers, and
                level up — while getting rewarded for your efforts. Start
                hunting today!
                <Quote className="text-yellow-500/50 size-5 inline ml-3" />
              </h3>
            </div>
            {/* CTA */}
            <div className="flex items-center gap-8 justify-center mb-10 max-[1280px]:mt-10 ">
              <SignUpButton mode="redirect">
                <Button className="rounded-full bg-violet-500 cursor-pointer text-white text-xs sm:text-base font-inter px-2 py-3 sm:py-5!">
                  Start Hunting Now
                  <Crosshair className="ml-2" />
                </Button>
              </SignUpButton>
              <SignInButton mode="redirect">
                <Button
                  variant="outline"

                  className="rounded-full cursor-pointer text-white hover:text-white text-xs sm:text-base font-inter px-2 py-3 sm:py-5!  "
                >
                  Create Bounty <Codesandbox className="ml-2" />{" "}
                </Button>
              </SignInButton>
            </div>
            <Separator className="max-[1280px]:max-w-[80%]" />
            <div className="grid grid-cols-3 gap-8 place-items-center my-4">
              <div>
                <div className="text-3xl lg:text-4xl font-medium tracking-tight text-white mb-1">
                  288%
                </div>
                <div className="text-sm text-neutral-300 font-medium">
                  More Vulnerabilities
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-medium tracking-tight text-white mb-1">
                  20X
                </div>
                <div className="text-sm text-neutral-300 font-medium">
                  Faster Triage
                </div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-medium tracking-tight text-white mb-1">
                  $4M+
                </div>
                <div className="text-sm text-neutral-300 font-medium">
                  Rewards Paid
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="">
            <HeroAnimation />
          </div>
        </div>

        <div className="absolute -top-10 left-0 md:top-0 md:right-40 w-full max-w-[940px] h-[400px] bg-indigo-700/75 sm:bg-indigo-700/40 blur-[200px] rounded-full pointer-events-none -z-10" />
        <div className="absolute hidden md:block bottom-48 -left-32 w-full max-w-[400px] h-[150px] bg-indigo-700 blur-[200px] rounded-full pointer-events-none -z-10" />
        {/* <div className="absolute top-0 left-0 w-full h-120 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-size-[36px_36px] -z-10" /> */}
      </main>
    </div>
  );
};

export default Hero;
