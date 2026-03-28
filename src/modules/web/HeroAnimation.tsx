"use client";
import { Wallet } from "lucide-react";
import Image from "next/image";
import React from "react";

const HeroAnimation = () => {
  return (
    <div>
      <div className="relative h-[600px] lg:h-[800px] overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_10%,black_40%,transparent)]">
        <div className="grid grid-cols-2 gap-6  h-full w-full">
          {/* Column 1 (Slower) */}
          <div className="animate-scroll-vertical">
            <div className="flex flex-col gap-6 pb-6">
              {/* Card 1: Live Bounties */}
              <div className="bg-linear-to-b from-white/20 to-transparent backdrop-blur-xl border border-white/20 p-6 rounded-3xl flex flex-col justify-between h-64 shadow-lg group hover:scale-[1.02] transition-transform duration-500 overflow-hidden relative font-inter">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">
                    Live Bounties
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  </div>
                </div>
                <div className="absolute top-0">
                  <img
                    src="/1.png"
                    alt="Icon"
                    className="w-[300px] h-[300px] object-contain opacity-90"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-5xl font-bold text-white tracking-tight mb-2">
                    1,240+
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-medium">
                      Active missions right now
                    </span>
                  </div>
                </div>
                <div className="absolute right-4 bottom-4 w-16 h-16 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>

              {/* Card 2: Top Bounty Hunter */}
              <div className="bg-linear-to-br from-indigo-500/20 to-transparent backdrop-blur-xl p-0 rounded-xl h-64 flex flex-col justify-between overflow-hidden relative group">
                {/* Image */}
                <Image
                  src="/avatar2.png"
                  alt="Top Hunter"
                  height={300}
                  width={300}
                  className="w-full h-full absolute  object-cover inset-0"
                />

                <div className="">
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a54] via-transparent to-transparent p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Top Bounty Hunter
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-white">
                      Raghav sk4401
                    </h4>
                  </div>
                </div>
              </div>

              {/* Card 3: New Character Unlocked */}
              <div className="relative h-80 rounded-3xl overflow-hidden group border border-yellow-400/20 bg-[#1A1A1A]/80 backdrop-blur-xl">
                <img
                  src="/2.png"
                  className="absolute inset-x-0 top-0 w-full h-[70%] object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-80"
                  alt="Top Hunter"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/90 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Top Bounty Hunter
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-white">
                    Ghost_ Protocol
                  </h4>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-gray-400">
                      Total Earned:{" "}
                      <span className="text-yellow-400 font-bold">
                        $125,400
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      RANK #01
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pb-6">
              {/* <!-- DUPLICATES FOR LOOP --> */}
              {/* Card 1 Duplicate */}
               <div className="bg-linear-to-b from-white/20 to-transparent backdrop-blur-xl border border-white/20 p-6 rounded-3xl flex flex-col justify-between h-64 shadow-lg group hover:scale-[1.02] transition-transform duration-500 overflow-hidden relative font-inter">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">
                    Live Bounties
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  </div>
                </div>
                <div className="absolute top-0">
                  <img
                    src="/1.png"
                    alt="Icon"
                    className="w-[300px] h-[300px] object-contain opacity-90"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-5xl font-bold text-white tracking-tight mb-2">
                    1,240+
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs font-medium">
                      Active missions right now
                    </span>
                  </div>
                </div>
                <div className="absolute right-4 bottom-4 w-16 h-16 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
              {/* Card 2 Duplicate */}
              <div className="bg-linear-to-br from-indigo-500/20 to-transparent backdrop-blur-xl p-0 rounded-xl h-64 flex flex-col justify-between overflow-hidden relative group">
                {/* Image */}
                <Image
                  src="/avatar2.png"
                  alt="Top Hunter"
                  height={300}
                  width={300}
                  className="w-full h-full absolute  object-cover inset-0"
                />

                <div className="">
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a54] via-transparent to-transparent p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Top Bounty Hunter
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-white">
                      Raghav sk4401
                    </h4>
                  </div>
                </div>
              </div>
              {/* Card 3 Duplicate */}
              <div className="relative h-80 rounded-3xl overflow-hidden group border border-yellow-400/20 bg-[#1A1A1A]/80 backdrop-blur-xl">
                <img
                  src="/2.png"
                  className="absolute inset-x-0 top-0 w-full h-[70%] object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-80"
                  alt="Top Hunter"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/90 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Top Bounty Hunter
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-white">
                    Ghost_ Protocol
                  </h4>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-gray-400">
                      Total Earned:{" "}
                      <span className="text-yellow-400 font-bold">
                        $125,400
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      RANK #01
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Column 2 (Faster/Delayed) --> */}
          <div className="animate-scroll-vertical-delayed pt-12">
            <div className="flex flex-col gap-6 pb-6">
              {/* Card 4: Progress / Gamification */}
              <div className="relative h-72 bg-indigo -400/10 backdrop-blur-xl rounded-xl overflow-hidden p-5 flex flex-col justify-between  group">
                <div className="absolute right-5 top-10 w-50 h-50">
                  <img
                    src="/dragon.png"
                    alt="Progress"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative z-10 text-white">
                  <div className="text-white text-sm font-semibold tracking-widest mb-1">
                    Hunter Status
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">Level 4</h3>
                </div>
                <div className="relative z-10 w-full">
                  <div className="flex justify-between text-xs text-white mb-2  tracking-tighter">
                    <span>Elite Grade</span>
                  </div>
                  <div className="bg-white/5 rounded-full h-3 w-full overflow-hidden border border-white/5">
                    <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                  </div>
                  <p className="text-white text-[10px] mt-2 text-right font-pop">
                    850 / 1000 XP
                  </p>
                </div>
              </div>

              {/* Card 5: Stats */}
              <div className="bg-linear-to-br from-yellow-400/60 to-yellow-400 p-5 rounded-3xl flex flex-col justify-between h-64 relative overflow-hidden group">
                {/* Image */}
                <Image
                  src="/avatar1.png"
                  alt="Top Hunter"
                  height={300}
                  width={300}
                  className="w-full h-full absolute  object-cover inset-0"
                />

                <div className="">
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a54] via-transparent to-transparent p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Top Bounty Hunter
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-white">
                      Raghav sk4401
                    </h4>
                  </div>
                </div>
              </div>

              {/* <!-- Card 6: New Task Listing --> */}
              {/* Card 6: Rewards Paid */}
              <div className="bg-[#1A1A1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-secondary/20 h-72 group relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold border border-secondary/20">
                    Rewards Distributed
                  </div>
                  <img
                    src="/6.png"
                    className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity"
                    alt="Rel"
                  />
                </div>

                <div className="flex-grow relative z-10">
                  <h4 className="text-3xl font-bold text-white mb-2">$4.2M+</h4>
                  <p className="text-sm text-gray-400">
                    Total rewards paid out to our global hunter community this
                    year.
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-gray-500 uppercase tracking-widest font-bold">
                      Safe & Secure
                    </div>
                    <div className="text-secondary font-mono">
                      verified_payouts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pb-6">
              {/* <!-- DUPLICATES FOR LOOP --> */}
              {/* Card 4 Duplicate */}
              <div className="relative h-72 bg-indigo-400/10 backdrop-blur-xl rounded-xl overflow-hidden p-5 flex flex-col justify-between  group">
                <div className="absolute right-5 top-10 w-50 h-50">
                  <img
                    src="/dragon.png"
                    alt="Progress"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative z-10 text-white">
                  <div className="text-white text-sm font-semibold tracking-widest mb-1">
                    Hunter Status
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">Level 4</h3>
                </div>
                <div className="relative z-10 w-full">
                  <div className="flex justify-between text-xs text-white mb-2  tracking-tighter">
                    <span>Elite Grade</span>
                  </div>
                  <div className="bg-white/5 rounded-full h-3 w-full overflow-hidden border border-white/5">
                    <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                  </div>
                  <p className="text-white text-[10px] mt-2 text-right font-pop">
                    850 / 1000 XP
                  </p>
                </div>
              </div>
              {/* Card 5 Duplicate */}
              <div className="bg-linear-to-br from-yellow-400/60 to-yellow-400 p-5 rounded-3xl flex flex-col justify-between h-64 relative overflow-hidden group">
                {/* Image */}
                <Image
                  src="/avatar1.png"
                  alt="Top Hunter"
                  height={300}
                  width={300}
                  className="w-full h-full absolute  object-cover inset-0"
                />

                <div className="">
                  <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a54] via-transparent to-transparent p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Top Bounty Hunter
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-white">
                      Raghav sk4401
                    </h4>
                  </div>
                </div>
              </div>
              {/* Card 6 Duplicate */}
              <div className="bg-[#1A1A1A]/80 backdrop-blur-xl p-6 rounded-3xl border border-secondary/20 h-72 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold border border-secondary/20">
                    Rewards Distributed
                  </div>
                  <img src="/6.png" className="w-8 h-8 opacity-40" alt="Rel" />
                </div>
                <div className="flex-grow relative z-10">
                  <h4 className="text-3xl font-bold text-white mb-2">$4.2M+</h4>
                  <p className="text-sm text-gray-400">
                    Total rewards paid out this year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
