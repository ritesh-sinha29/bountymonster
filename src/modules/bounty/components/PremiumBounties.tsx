import { BountyCard } from "./bountyCard";

/**
 * Filtered view that renders bounties passing a high-value threshold (e.g. >= 100).
 * Sorts them strictly by descending reward amount to showcase the most lucrative quests.
 */
export const PremiumBounties = ({ bounties, currentUser }: { bounties: any[], currentUser: any }) => {
  const premium = bounties.filter(bounty => {
    const val = bounty.rewardPerHunter || bounty.reward;
    return val >= 100;
  }).sort((a, b) => {
    const valA = a.rewardPerHunter || a.reward;
    const valB = b.rewardPerHunter || b.reward;
    return valB - valA;
  });

  if (premium.length === 0) {
    return <div className="col-span-full py-20 text-center text-muted-foreground/50">No premium high-reward bounties found.</div>;
  }

  return (
    <>
      {premium.map((bounty, index) => (
        <BountyCard key={bounty._id} bounty={bounty} index={index} currentUser={currentUser} />
      ))}
    </>
  );
};
