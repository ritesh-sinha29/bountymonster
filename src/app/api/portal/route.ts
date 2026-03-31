import { CustomerPortal } from "@polar-sh/nextjs";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/portal
 *
 * Opens Polar's Customer Portal where users can:
 *   - View invoices
 *   - Update billing details
 *   - Cancel or upgrade subscription
 *
 * Requires the user to be signed in (Clerk) and have a polarCustomerId
 * stored in Convex from a previous checkout.
 */
import { NextRequest } from "next/server";

export const GET = (req: NextRequest) => {
  return CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "sandbox",
    getCustomerId: async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      const subscription = await fetchQuery(api.subscriptions.getByClerkId, {
        clerkId: userId,
      });

      if (!subscription?.polarCustomerId) {
        throw new Error("No active subscription found for this user.");
      }

      return subscription.polarCustomerId;
    },
    returnUrl: `${req.nextUrl.origin}/subscription`,
  })(req);
};
