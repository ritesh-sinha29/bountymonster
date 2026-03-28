import React from "react";
import { Star, Quote } from "lucide-react";

const Section3 = () => {
  const testimonials = [
    {
      name: 'Alex "Shadow" Rivera',
      role: "Elite Void Hunter",
      content:
        "Bounty Monster transformed my side-hustle into a high-octane career. The XP system keeps me motivated, and the USDC payouts are lightning fast.",
      level: "Lv. 88",
      avatar: "https://i.pravatar.cc/150?u=alex",
    },
    {
      name: "Sarah Chen",
      role: "Block Crusader",
      content:
        "Finally, a platform that understands developers. I love how completing GitHub tasks actually feels like leveling up a character. The community is amazing!",
      level: "Lv. 64",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      name: "Marcus Thorne",
      role: "Shadow Stalker",
      content:
        "The exclusive leagues are where the real action is. Reaching the Diamond league opened up opportunities I never thought possible in bug hunting.",
      level: "Lv. 92",
      avatar: "https://i.pravatar.cc/150?u=marcus",
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Hall of <span className="text-indigo-500">Fame</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Hear from the legendary hunters who have mastered the arena and
            claimed their glory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative p-5 rounded-3xl bg-linear-to-b from-white/10 to-black border border-indigo-500/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
              
              <Quote className="w-10 h-10 text-indigo-500/20 mb-6" />
              
              <p className="text-zinc-300 text-lg leading-relaxed mb-8 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full border border-white/10"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white">
                    {t.level.split(' ')[1]}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-tight">{t.name}</h4>
                  <p className="text-indigo-400 text-xs font-medium uppercase tracking-wider">
                    {t.role}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-500/80 fill-yellow-500/20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section3;
