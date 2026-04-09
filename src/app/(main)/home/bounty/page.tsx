"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Globe2, LucideCrosshair, Compass, Briefcase, Crown, Flame, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { TrendingBounties } from "@/modules/bounty/components/TrendingBounties";
import { ExploreBounties } from "@/modules/bounty/components/ExploreBounties";
// import { PremiumBounties } from "@/modules/bounty/components/PremiumBounties";
import { MyActivity } from "@/modules/bounty/components/MyActivity";
import { MyBounties } from "@/modules/bounty/components/MyBounties";

const BountyPage = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const { results: bounties, status, loadMore } = usePaginatedQuery(
    api.bounties.getBountiesPaginated,
    {},
    { initialNumItems: 20 }
  );
  const currentUser = useQuery(api.users.getCurrentUser);

  const tabs = [
    { id: "trending", label: "Trending", icon: Flame },
    { id: "explore", label: "Explore Bounties", icon: Compass },
    // { id: "premium", label: "Premium Bounties", icon: Crown },
    { id: "played", label: "My Activity", icon: Gamepad2 },
    { id: "my", label: "My Bounties", icon: Briefcase },
  ];

  const renderActiveBounties = () => {
    switch (activeTab) {
      case "explore":
        return <ExploreBounties bounties={bounties} currentUser={currentUser} />;
      // case "premium":
      //   return <PremiumBounties bounties={bounties} currentUser={currentUser} />;
      case "played":
        return <MyActivity />;
      case "my":
        return <MyBounties bounties={bounties} currentUser={currentUser} />;
      case "trending":
      default:
        return <TrendingBounties bounties={bounties} currentUser={currentUser} />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between w-full mb-8">
        <h1 className="text-2xl font-semibold uppercase italic tracking-tighter">
          Discover all <span className="text-primary">bounties</span>{" "}
          <Globe className="h-6 w-6 inline ml-2" />
        </h1>
        <Link href="/home/bounty/create-bounty">
          <Button
            className="cursor-pointer text-white"
            variant={"default"}
            size="sm"
          >
            Create new <LucideCrosshair className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all whitespace-nowrap",
                isActive 
                  ? "bg-primary/20 border-primary text-primary" 
                  : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {renderActiveBounties()}
      </div>

      {status === "CanLoadMore" && (activeTab === "trending" || activeTab === "explore") && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => loadMore(20)}
            className="border-white/10 text-white/60 hover:text-white hover:border-white/30"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default BountyPage;
