"use client";
import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const Section4 = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I start my first hunt?",
      answer:
        "Simply create an account, select your character class, and browse the 'Available Quests' section. Follow the specific instructions for each task and submit your proof of work.",
    },
    {
      question: "What kind of rewards can I earn?",
      answer:
        "Hunters earn USDC bounty rewards, XP for their character, and exclusive digital loot like weapon skins and badge modifiers. Some special events also feature physical merch.",
    },
    {
      question: "How does the verification system work?",
      answer:
        "We use an automated engine to verify social tasks and GitHub activity. For complex tasks, our elite human triage team reviews submissions within 24 hours.",
    },
    {
      question: "Can I change my character class later?",
      answer:
        "Characters are permanent to your identity to ensure progression value, but as you reach higher levels, you can unlock 'Multiclassing' abilities to use powers from other lineages.",
    },
    {
      question: "Are high-tier bounties available to everyone?",
      answer:
        "While anyone can join, certain legendary-tier bounties require minimal character levels or ranking within a specific league (e.g., Diamond League) to ensure quality and expertise.",
    },
  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/50 text-xs font-medium text-zinc-400 mb-6">
            <HelpCircle className="w-4 h-4" />
            Common Inquiries
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            The <span className="text-indigo-400">Archives</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Everything you need to know about navigating the Bounty Monster arena.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-zinc-900/20 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-semibold text-white tracking-tight">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0 px-6"
                }`}
              >
                <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section4;
