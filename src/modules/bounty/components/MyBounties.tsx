import { BountyCard } from "./bountyCard";

/**
 * Filtered view that renders only the bounties authored by the active user.
 */
export const MyBounties = ({ bounties, currentUser }: { bounties: any[], currentUser: any }) => {
  const myBounties = bounties
    .filter(bounty => bounty.creatorId === currentUser?._id)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (!currentUser) return null;

  if (myBounties.length === 0) {
    return <div className="col-span-full py-20 text-center text-muted-foreground/50">You haven't created any bounties yet.</div>;
  }

  return (
    <>
      {myBounties.map((bounty, index) => (
        <BountyCard key={bounty._id} bounty={bounty} index={index} currentUser={currentUser} />
      ))}
    </>
  );
};
