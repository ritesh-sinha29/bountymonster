import { BountyCard } from "./bountyCard";


export const ExploreBounties = ({ bounties, currentUser, limit }: { bounties: any[], currentUser: any, limit?: number }) => {
  const explore = [...bounties]
    .filter(b => (b.creatorId ?? b.userId) !== currentUser?._id)
    .sort((a, b) => b.createdAt - a.createdAt);

  const displayBounties = limit ? explore.slice(0, limit) : explore;

  if (displayBounties.length === 0) {
    return <div className="col-span-full py-20 text-center text-muted-foreground/50 border border-dashed rounded-lg">No bounties found. Be the first to create one!</div>;
  }

  return (
    <>
      {displayBounties.map((bounty, index) => (
        <BountyCard key={bounty._id} bounty={bounty} index={index} currentUser={currentUser} />
      ))}
    </>
  );
};
