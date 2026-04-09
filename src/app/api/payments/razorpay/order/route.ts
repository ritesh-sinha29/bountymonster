import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';

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
 * Razorpay requires amounts in the smallest currency unit (paise for INR)
 */
const PAISA_MULTIPLIER = 100;

/**
 * Creates a new Razorpay order for one-time payments.
 * Ensures the user is authenticated and the amount is valid.
 */

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', planName } = await req.json();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount is required and must be a positive number' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * PAISA_MULTIPLIER),
      currency,
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      notes: {
        userId,        // Clerk user ID — use this in webhooks to find the right user
        planName: planName || 'unknown',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,   // in paise
      currency: order.currency,
    });

  } catch (error: any) {
    console.error('[Razorpay Order]', error?.error?.description || error?.message || error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
