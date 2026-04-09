import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

/**
 * Fail fast at startup if credentials are missing
 */
if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('[Razorpay] Missing NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in env');
}

/**
 * Module-level singleton — safe to reuse across requests
 */
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Cancels an active Razorpay subscription.
 * Receives the subscription ID from the client and terminates the cycle immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'subscriptionId is required' }, { status: 400 });
    }

    /**
     * cancel_at_cycle_end: false means cancel immediately.
     * The user loses access exactly when this executes, rather than at the end of the billing period.
     */
    await razorpay.subscriptions.cancel(subscriptionId, false);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[Razorpay Cancel]', error?.error?.description || error?.message || error);
    return NextResponse.json({ error: error?.message || 'Failed to cancel subscription' }, { status: 500 });
  }
}
