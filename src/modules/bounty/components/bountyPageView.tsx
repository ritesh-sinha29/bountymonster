"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BountyCard } from "./bountyCard";
import { BountyStats } from "./bountyStats";
import { CreateBountyDialog } from "./createBountyDialog";
import type { BountyStatus } from "../types";
import {
  Plus,
  Search,
  Swords,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Zap,
  CalendarClock,
  XCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BountyPageView = () => {
  const [activeTab, setActiveTab] = useState<"all" | BountyStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);

  const backendBounties = useQuery(api.bounties.getBounties, {}) || [];

  const filteredBounties = useMemo(() => {
    let result = backendBounties;

    // Filter by tab/status
    if (activeTab !== "all") {
      result = result.filter((b) => b.status === activeTab);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b: any) =>
          b.name?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.type?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeTab, searchQuery]);

  const tabCounts = useMemo(() => {
    return {
      all: backendBounties.length,
      active: backendBounties.filter((b: any) => b.status === "active").length,
      scheduled: backendBounties.filter((b: any) => b.status === "scheduled").length,
      closed: backendBounties.filter((b: any) => b.status === "closed").length,
    };
  }, [backendBounties]);

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/[0.04]">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/[0.03] rounded-full blur-3xl" />
        </div>

        <div className="relative px-6 lg:px-8 pt-6 pb-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-1"
              >
                <div className="size-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shadow-inner">
                  <Swords className="size-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Bounty Campaigns
                </h1>
              </motion.div>
              <p className="text-sm text-muted-foreground/60 ml-1">
                Design, launch, and track all your bounty programs.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-4 hidden md:flex">
                <div className="flex flex-col gap-1.5 w-44">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground/80">User Impact Score</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05]">
                    <div className="h-full bg-gradient-to-r from-primary/50 to-primary w-[85%] rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.8)]" />
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Level: <span className="text-foreground font-medium">Visionary</span> - 850 / 1000 XP
                  </div>
                </div>


              </div>

              <div className="w-px h-10 bg-white/[0.08] hidden md:block" />

              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-transparent border border-primary/40 hover:bg-primary/10 text-primary shadow-[inset_0_0_15px_rgba(var(--color-primary),0.1)] gap-2 h-10 px-5 rounded-xl transition-all"
              >
                <Plus className="size-4" />
                New Bounty
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <BountyStats bounties={backendBounties} />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 lg:px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            {[
              { value: "all", label: "All", icon: Sparkles },
              { value: "active", label: "Active", icon: Zap },
              { value: "scheduled", label: "Scheduled", icon: CalendarClock },
              { value: "closed", label: "Closed", icon: XCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const count = tabCounts[tab.value as keyof typeof tabCounts];
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeTab === tab.value
                      ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      activeTab === tab.value
                        ? "bg-primary/20 text-primary"
                        : "bg-white/[0.04] text-muted-foreground/30"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gradient-to-r from-white/[0.08] to-white/[0.02] border-white/[0.1] focus:border-primary/40 h-10 pl-11 pr-4 w-[240px] text-sm rounded-full shadow-inner text-white placeholder:text-muted-foreground/40"
              />
            </div>
          </div>
        </div>

        {/* Bounty Grid */}
        <AnimatePresence mode="wait">
          {filteredBounties.length > 0 ? (
            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {filteredBounties.map((bounty: any, i: number) => (
                <BountyCard key={bounty._id || bounty.id} bounty={bounty} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="size-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                <Swords className="size-7 text-muted-foreground/20" />
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground/50 mb-1">
                No bounties found
              </h3>
              <p className="text-xs text-muted-foreground/30 mb-4">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first bounty to get started"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setCreateOpen(true)}
                  variant="outline"
                  className="bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.06] gap-1.5 text-xs"
                >
                  <Plus className="size-3.5" />
                  Create Bounty
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Dialog */}
      <CreateBountyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {}}
      />
    </div>
  );
};
