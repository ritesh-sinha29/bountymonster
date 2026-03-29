"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditBountyButtonProps {
  bountyId: string;
  createdAt: number;
  editedAt?: number;
}

/**
 * Provides access to edit a bounty, enforcing business rules 
 * (e.g. 24-hour edit window, single-edit limit) visually in the UI.
 */
export function EditBountyButton({
  bountyId,
  createdAt,
  editedAt,
}: EditBountyButtonProps) {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const bounty = useQuery(api.bounties.getBounty, {
    id: bountyId as Id<"bounties">,
  });

  if (currentUser === undefined || bounty === undefined) return null;

  const isCreator =
    currentUser && bounty && bounty.creatorId === currentUser._id;
  if (!isCreator) return null;

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const withinEditWindow = Date.now() - createdAt <= TWENTY_FOUR_HOURS;
  const alreadyEdited = !!editedAt;
  const canEdit = withinEditWindow && !alreadyEdited;

  let editBlockedReason = "";
  if (!canEdit) {
    if (alreadyEdited) editBlockedReason = "Already edited once";
    else if (!withinEditWindow) editBlockedReason = "Edit window expired (24h)";
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        onClick={() =>
          canEdit && router.push(`/home/bounty/edit-bounty/${bountyId}`)
        }
        disabled={!canEdit}
        className={
          canEdit
            ? "bg-blue-500 hover:bg-blue-600 text-white gap-2 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
            : "bg-white/5 text-white/30 border border-white/10 gap-2 font-bold cursor-not-allowed"
        }
      >
        <Pencil className="w-4 h-4" />
        Edit Bounty
      </Button>
      {editBlockedReason && (
        <span className="text-[10px] text-red-400/70 font-medium italic">
          {editBlockedReason}
        </span>
      )}
    </div>
  );
}
