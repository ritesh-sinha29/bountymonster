/**
 * Preloads a list of image URLs into the browser cache so they appear
 * instantly when used later in the app. Call this as early as possible
 * (e.g. at the end of onboarding) so images are ready before the user
 * navigates to pages that display them.
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === "undefined") return;

  urls.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

/**
 * All static images used across the main app that benefit from
 * early preloading (character avatars, leaderboard assets, etc.)
 */
export const APP_IMAGES_TO_PRELOAD = [
  // Character images
  "/dragon.png",
  "/3.png",
  "/4.png",
  "/5.png",
  "/6.png",
  // Leaderboard / shared assets
  "/silver-wreath.png",
  "/leaderboard_cup.svg",
  "/medal.png",
  "/character-bg.png",
] as const;
