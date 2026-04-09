"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BountyCard } from "./bountyCard";
import { Loader2 } from "lucide-react";

/**
 * Filtered view that renders bounties the active user has joined.
 * Fetches data asynchronously from the backend, handling intermediate loading states.
 */
export const MyActivity = () => {
  const joinedBounties = useQuery(api.participants.getMyJoinedBounties);
  const currentUser = useQuery(api.users.getCurrentUser);

  if (joinedBounties === undefined || currentUser === undefined) {
    return (
      <div className="col-span-full flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (joinedBounties.length === 0) {
    return (
      <div className="col-span-full py-20 text-center text-muted-foreground/50">
        Your activity log is empty. Join a bounty to get started!
      </div>
    );
  }

  return (
    <>
      {joinedBounties.map((bounty: any, index: number) => (
        <BountyCard key={bounty._id} bounty={bounty} index={index} currentUser={currentUser} />
      ))}
    </>
  );
};
