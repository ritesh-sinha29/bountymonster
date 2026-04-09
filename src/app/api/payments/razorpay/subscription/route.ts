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
 * Creates a new Razorpay subscription (recurring payment).
 * Idempotently searches for an existing plan or creates a new one to prevent duplication.
 */
export async function POST(req: NextRequest) {
  try {
    const { amount, planName, currency = 'INR' } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount is required and must be a positive number' }, { status: 400 });
    }

    const amountInPaise = Math.round(amount * 100); // Razorpay expects paise

    /**
     * Fetch existing plans and reuse a matching one to avoid duplicates in the dashboard.
     * NOTE: plans.all() returns up to 10 by default — using { count: 100 } handles larger catalogs.
     */
    const plans = await razorpay.plans.all({ count: 100 });
    let targetPlan = (plans.items as any[]).find(
      (p) => p.item.amount === amountInPaise && p.period === 'monthly'
    );

    if (!targetPlan) {
      targetPlan = await razorpay.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: planName || 'Pro Hunter',
          amount: amountInPaise,
          currency,
          description: `Monthly subscription for ${planName || 'Pro Hunter'}`,
        },
      });
    }

    /**
     * total_count = 12 means the subscription auto-expires after 12 billing cycles (1 year)
     * Set to 0 for indefinite — but explicit counts prevent zombie subscriptions from lingering forever.
     */
    const subscription = await razorpay.subscriptions.create({
      plan_id: targetPlan.id,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      amount,
      currency,
    });

  } catch (error: any) {
    console.error('[Razorpay Subscription]', error?.error?.description || error?.message || error);
    return NextResponse.json({ error: error?.message || 'Failed to create subscription' }, { status: 500 });
  }
}
