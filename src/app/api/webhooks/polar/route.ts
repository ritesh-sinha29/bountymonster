import { Webhooks } from "@polar-sh/nextjs";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

/**
 * POST /api/webhooks/polar
 *
 * Polar sends signed events here. The Webhooks adapter from @polar-sh/nextjs
 * verifies the signature automatically using POLAR_WEBHOOK_SECRET.
 *
 * Events handled:
 *   - order.paid              → upsert subscription (covers one-time purchases too)
 *   - subscription.created    → upsert subscription record
 *   - subscription.updated    → upsert on plan change / renewal
 *   - subscription.revoked    → mark as canceled
 *
 * Setup in Polar Dashboard:
 *   Settings → Webhooks → Add Endpoint
 *   URL: https://your-domain.com/api/webhooks/polar
 *   Events: order.paid, subscription.created, subscription.updated, subscription.revoked
 *
 * IMPORTANT: Set customer.externalId = Clerk userId when creating checkout sessions
 * so the webhook can link Polar customers back to your users.
 */
export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  // Fires on every event — useful for debugging; remove/comment in production
  onPayload: async (_payload) => {
    // console.log("[Polar Webhook]", _payload.type);
  },

  onOrderPaid: async (payload) => {
    const clerkId = payload.data.customer?.externalId;
    if (!clerkId) return;

    // For one-time purchases there may be no subscription object
    const subId = payload.data.subscription?.id ?? `order_${payload.data.id}`;

    await fetchMutation(api.subscriptions.upsertSubscription, {
      clerkId,
      polarCustomerId: payload.data.customer?.id ?? "",
      polarSubscriptionId: subId,
      productId: payload.data.productId ?? "",
      priceId: payload.data.items?.[0]?.productPriceId ?? "",
      status: "active",
      currentPeriodEnd: payload.data.subscription?.currentPeriodEnd
        ? new Date(payload.data.subscription.currentPeriodEnd).getTime()
        : Date.now() + 1000 * 60 * 60 * 24 * 365,
    });
  },

  onSubscriptionCreated: async (payload) => {
    const clerkId = payload.data.customer?.externalId;
    if (!clerkId) return;

    await fetchMutation(api.subscriptions.upsertSubscription, {
      clerkId,
      polarCustomerId: payload.data.customer?.id ?? "",
      polarSubscriptionId: payload.data.id,
      productId: payload.data.product?.id ?? "",
      priceId: payload.data.prices?.[0]?.id ?? "",
      status: payload.data.status,
      currentPeriodEnd: new Date(payload.data.currentPeriodEnd).getTime(),
    });
  },

  onSubscriptionUpdated: async (payload) => {
    const clerkId = payload.data.customer?.externalId;
    if (!clerkId) return;

    await fetchMutation(api.subscriptions.upsertSubscription, {
      clerkId,
      polarCustomerId: payload.data.customer?.id ?? "",
      polarSubscriptionId: payload.data.id,
      productId: payload.data.product?.id ?? "",
      priceId: payload.data.prices?.[0]?.id ?? "",
      status: payload.data.status,
      currentPeriodEnd: new Date(payload.data.currentPeriodEnd).getTime(),
    });
  },

  onSubscriptionRevoked: async (payload) => {
    await fetchMutation(api.subscriptions.cancelSubscription, {
      polarSubscriptionId: payload.data.id,
    });
  },
});
