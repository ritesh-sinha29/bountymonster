import { BountyCard } from "./bountyCard";


export const ExploreBounties = ({ bounties, currentUser }: { bounties: any[], currentUser: any }) => {
  const explore = [...bounties]
    .filter(b => b.creatorId !== currentUser?._id)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (explore.length === 0) {
    return <div className="col-span-full py-20 text-center text-muted-foreground/50 border border-dashed rounded-lg">No bounties found. Be the first to create one!</div>;
  }

  return (
    <>
      {explore.map((bounty, index) => (
        <BountyCard key={bounty._id} bounty={bounty} index={index} currentUser={currentUser} />
      ))}
    </>
  );
};
