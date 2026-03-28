import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Sword, Trophy } from "lucide-react";

const Section2 = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Hero",
      description:
        "Select your character class—Shadow Stalker, Void Hunter, or Block Crusader—and equip your initial mystical gear.",
      label: "Build Your Legend",
      image: "/card1.png",
      color: "from-blue-600 to-indigo-700",
    },
    {
      id: 2,
      title: "Accept Elite Quests",
      description:
        "Browse real-world tasks from top tech companies. Upload proof of work to earn massive XP and rewards.",
      label: "Master the Hunt",
      image: "/card2.png",
      color: "from-indigo-600 to-violet-700",
    },
    {
      id: 3,
      title: "Ascend the Ranks",
      description:
        "Unlock legendary powers at every level and stream your USDC bounty directly to your crypto wallet.",
      label: "Claim Your Glory",
      image: "/card3.png",
      color: "from-violet-600 to-purple-700",
    },
  ];

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-medium text-indigo-400 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            How It Works
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Your Journey to <span className="text-indigo-500">Mastery</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">
            Follow these three steps to transform from a novice hunter to a
            legendary Bounty Monster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[400px]">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`group relative  overflow-hidden border rounded-3xl border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/20 bg-linear-to-b from-white/10 to-black`}
            >
              {/* User Specified Image Layer */}
              <div className="absolute inset-0 z-10  opacity-40 group-hover:scale-105 transition-transform duration-700">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-contain mx-auto mt-10"
                />
              </div>

              {/* Glass Overlay for Text Readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent z-20" />

              {/* Content */}
              <div className="relative z-30 h-full p-6 flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                  {step.title}
                </h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-auto max-w-[90%]">
                  {step.description}
                </p>

                <div className="flex items-center justify-between mt-8">
                  <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">
                    {step.label}
                  </div>
                  <button 
                    aria-label={`Get started with ${step.title}`}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-black shadow-lg shadow-white/10 hover:bg-zinc-200 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Top Accent Light */}
              <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-white/10 to-transparent pointer-events-none z-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;