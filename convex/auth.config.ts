import { AuthConfig } from "convex/server";

/**
 * Authentication configuration for the Convex backend.
 * Integrates with Clerk to securely validate user identities using JSON Web Tokens (JWT).
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
