import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Verifies Razorpay webhook signatures securely.
 * Handles both one-time order payments and recurring subscription payments.
 */
export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'payment_id and signature are required' }, { status: 400 });
    }

    /**
     * Determines the signature composition order.
     * Order signature mapping:        "order_id|payment_id"
     * Subscription signature mapping: "payment_id|subscription_id"
     */
    let body = '';
    if (razorpay_order_id) {
      body = `${razorpay_order_id}|${razorpay_payment_id}`;
    } else if (razorpay_subscription_id) {
      body = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    } else {
      return NextResponse.json({ error: 'Missing razorpay_order_id or razorpay_subscription_id' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    /**
     * Executes a constant-time comparison of the computed vs received signatures.
     * This protects against timing attacks where attackers guess the key based on response time.
     */
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    /**
     * WARNING: Currently plan update happens client-side via Convex mutation after this returns.
     * For high production safety, implement server-side DB plan updates exactly here.
     */

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });

  } catch (error: any) {
    console.error('[Razorpay Verify]', error?.message || error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
