"use client";

import { Button } from "@/components/ui/button";
import { Globe, Globe2, LucideCrosshair } from "lucide-react";
import Link from "next/link";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { BountyCard } from "@/modules/bounty/components/bountyCard";

const BountyPage = () => {
  const bounties = useQuery(api.bounties.getBounties) || [];

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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {bounties?.map((bounty: any, index: number) => (
          <BountyCard key={bounty._id} bounty={bounty} index={index} />
        ))}
        {bounties?.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground/50">
            No bounties have been created yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
};

export default BountyPage;
