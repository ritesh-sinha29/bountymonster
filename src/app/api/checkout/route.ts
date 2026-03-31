import { Checkout } from "@polar-sh/nextjs";

export const dynamic = "force-dynamic";

/**
 * GET /api/checkout?productPriceId=xxx
 *
 * Polar's Checkout adapter handles session creation and redirects
 * the user to Polar's hosted checkout page automatically.
 *
 * Query params accepted by Polar:
 *   - productPriceId (required) – the price ID from your Polar dashboard
 *   - customerId (optional)     – link to an existing Polar customer
 */
import { NextRequest } from "next/server";

export const GET = (req: NextRequest) => {
  return Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "sandbox",
    successUrl: `${req.nextUrl.origin}/subscription`,
  })(req);
};
