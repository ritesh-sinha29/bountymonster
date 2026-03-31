import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Polar } from "@polar-sh/sdk";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await fetchQuery(api.subscriptions.getByClerkId, {
      clerkId: userId,
    });

    if (!subscription || !subscription.polarSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "sandbox",
    });

    // Cancel the subscription at period end
    await polar.subscriptions.update({
      id: subscription.polarSubscriptionId,
      subscriptionUpdate: {
        cancelAtPeriodEnd: true,
      },
    });

    // Also update our database immediately so the UI reflects it
    // Wait, let's keep it simple. The webhook will eventually fire! 
    // But for instant feedback, we can just let Convex know.
    // The webhook `subscription.updated` will also fire.
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
