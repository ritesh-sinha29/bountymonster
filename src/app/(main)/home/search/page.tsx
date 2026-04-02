"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  History,
  X,
  ArrowRight,
  SearchIcon,
  Target,
  Trash2,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Real history query from Convex
  const history = useQuery(api.search.getHistory) || [];
  const clearHistory = useMutation(api.search.clearAllHistory);
  const deleteHistoryItem = useMutation(api.search.deleteHistory);

  return (
    <div className="p-6">
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="grow">
          <h1 className="text-2xl font-semibold italic text-white tracking-tight">
            Search for Bounties
          </h1>
          <p className="text-sm text-white/40 font-medium  mt-1 flex items-center gap-2">
            <Sparkles className="size-3" /> Find your next challenge
          </p>
        </div>
      </motion.div>

      <div className="w-full max-w-5xl mx-auto">
        <div className="relative mt-10">
          <motion.div
            className={`
             relative flex items-center p-1.5 rounded-2xl border transition-all duration-300
             ${isFocused ? "border-primary/50 bg-[#0A0D15]/80 ring-4 ring-primary/5 shadow-[0_0_40px_rgba(var(--color-primary),0.05)]" : "border-white/10 bg-white/[0.02] shadow-sm"}
           `}
          >
            <div className="pl-4 pr-3 py-2">
              <Search
                className={`size-5 transition-colors ${isFocused ? "text-primary" : "text-white/20"}`}
              />
            </div>

            <input
              type="text"
              placeholder="Search by mission name, type, or rewards..."
              className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder:text-white/20 px-2 h-9"
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Delay blur to allow clicking dropdown items
                setTimeout(() => setIsFocused(false), 200);
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex items-center gap-2 pr-1.5">
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="size-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <Button
                variant="outline"
                size="icon"
                className="size-9  border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-white/40 hover:text-white"
              >
                <SlidersHorizontal className="size-4" />
              </Button>
              <Button className="h-9 text-white bg-primary cursor-pointer">
                Search <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </motion.div>

          {/* ── DROPDOWN SUGGESTIONS ── */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-3 z-50 bg-[#07090E] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl"
              >
                <div className="p-2 space-y-1">
                  {/* Search History Section */}
                  {history.length > 0 && (
                    <div className="px-3 py-2 mt-1">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        Recent History
                      </span>
                    </div>
                  )}

                  {history.map((item) => (
                    <button
                      key={item._id}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] group transition-all"
                      onClick={() => setSearchQuery(item.query)}
                    >
                      <div className="flex items-center gap-3">
                        <History className="size-4 text-white/20 group-hover:text-primary transition-colors" />
                        <span className="text-[13px] font-medium text-white/60 group-hover:text-white/90 truncate max-w-[200px]">
                          {item.query}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <span className="text-[10px] font-mono text-white/20">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <ChevronRight className="size-3 text-white/20 group-hover:text-primary" />
                      </div>
                    </button>
                  ))}

                  {/* Trending Or Relevant Section (Placeholder) */}
                  <div className="px-3 py-2 mt-2">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                      Trending Now
                    </span>
                  </div>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] group transition-all">
                    <TrendingUp className="size-4 text-white/20 group-hover:text-orange-500 transition-colors" />
                    <span className="text-[13px] font-medium text-white/60 group-hover:text-white/90">
                      Web3 Marketing Campaign
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── SEARCH RESULTS / HISTORY DISPLAY ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6 pt-6"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mt-10">
          <div className="flex items-center gap-2">
            <History className="size-4 text-white/40" />
            <h2 className="text-base font-semibold text-white tracking-tight">
              Recent Interactions
            </h2>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-[11px] text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all gap-1.5"
              onClick={() => clearHistory()}
            >
              <Trash2 className="size-3.5" /> Clear History
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-white/5 rounded-3xl bg-white/1">
            <div className="size-16 rounded-full bg-white/2 flex items-center justify-center mb-4">
              <SearchIcon className="size-6 text-white/10" />
            </div>
            <h3 className="text-white/60 font-medium">No recent searches</h3>
            <p className="text-white/20 text-xs mt-1">
              Your search history will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 hover:border-white/10 transition-all cursor-pointer overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-1.5 rounded-lg bg-white/5 text-white/20 group-hover:text-primary transition-colors">
                      <History className="size-3.5" />
                    </div>
                    <button
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/10 hover:text-red-400 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem({ id: item._id });
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">
                    {item.query}
                  </p>
                  <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tight">
                    Searched on {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* Subtle background glow */}
                <div className="absolute -right-4 -bottom-4 size-20 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SearchPage;
