<!-- Step 1: Install dependencies -->
pnpm install

<!-- Step 2: have the .env.local -->
# Deployment used by `npx convex dev`

CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
<!-- dont create these 3 above - will auto created -->
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/auth/callback
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/callback

# /sign-up/SignUp_clerk_catchall_check_1771681185552

# CLERK---------------

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=

<!-- Note to get clerk keys ---->
1. go to clerk
2. create new app
3. choose nextjs
4. copy the keys
5. go to configure -- jwt or session - chhose template convex -- copy issues key.
 -->

<!-- Step 3: Run this command -->
pnpm dlx convex dev
then - choose new project - name anything
On successful creation it will give you deployment id and url
<!-- Step 4: Run the development server -->
pnpm dev
npm dev
<!-- To build -->
pnpm build
npm build
