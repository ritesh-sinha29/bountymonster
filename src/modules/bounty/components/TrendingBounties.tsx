import { BountyCard } from "./bountyCard";

/**
 * Renders an actively weighted list of bounties by visibility or reward priority.
 * Prefers "views", but gracefully falls back to total theoretical XP capacity (xp * hunters).
 */
export const TrendingBounties = ({ bounties, currentUser }: { bounties: any[], currentUser: any }) => {
  const trending = [...bounties]
    .filter(b => b.creatorId !== currentUser?._id)
    .sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0));

  if (trending.length === 0) {
    return <div className="col-span-full py-20 text-center text-muted-foreground/50">No trending bounties right now.</div>;
  }

  return (
    <>
      {trending.map((bounty, index) => (
        <BountyCard key={bounty._id} bounty={bounty} index={index} />
      ))}
    </>
  );
};
