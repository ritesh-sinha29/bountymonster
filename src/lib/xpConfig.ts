/**
 * Shared XP & Level configuration — frontend mirror of convex/xpConfig.ts
 * Keep both files in sync.
 */

export const LEVEL_THRESHOLDS = [
  0,
  500,
  1500,
  2500,
  3999,
  6000,
  8500,
  11500,
  15000,
  19500,
  25000,
  31500,
  39500,
  49500,
  61500,
];

export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export function getXpForLevel(level: number): number {
  const idx = Math.max(0, level - 1);
  return LEVEL_THRESHOLDS[Math.min(idx, LEVEL_THRESHOLDS.length - 1)];
}

export function getXpForNextLevel(currentLevel: number): number {
  const idx = currentLevel;
  if (idx >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return LEVEL_THRESHOLDS[idx];
}

export function getXpPerTask(requirementLevel: number): number {
  if (requirementLevel <= 1) return 150;
  if (requirementLevel === 2) return 200;
  if (requirementLevel === 3) return 275;
  if (requirementLevel === 4) return 375;
  if (requirementLevel === 5) return 500;
  if (requirementLevel === 6) return 650;
  if (requirementLevel === 7) return 825;
  if (requirementLevel === 8) return 1000;
  if (requirementLevel === 9) return 1200;
  return 1500;
}

/** XP needed within current level (for progress bar) */
export function getXpProgress(totalXp: number): {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  percent: number;
  title: string;
  isMaxLevel: boolean;
} {
  const level = getLevelFromXp(totalXp);
  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;
  const levelStart = getXpForLevel(level);
  const levelEnd = isMaxLevel ? levelStart : getXpForNextLevel(level);

  const xpIntoLevel = totalXp - levelStart;
  const xpForNextLevel = levelEnd - levelStart;
  const percent = isMaxLevel ? 100 : Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100));

  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    percent,
    title: LEVEL_TITLES[level] ?? "Bounty God",
    isMaxLevel,
  };
}

export const LEVEL_TITLES: Record<number, string> = {
  1:  "Rookie Hunter",
  2:  "Apprentice",
  3:  "Scout",
  4:  "Tracker",
  5:  "Pro Hunter",
  6:  "Veteran",
  7:  "Elite",
  8:  "Champion",
  9:  "Warlord",
  10: "Legendary",
  11: "Mythic",
  12: "Ancient",
  13: "Titan",
  14: "Ascended",
  15: "Bounty God",
};
