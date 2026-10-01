import { Rank, RankThreshold } from './types';

export const RANK_THRESHOLDS: RankThreshold[] = [
  {
    rank: 'rookie',
    minXp: 0,
    maxXp: 999,
  },
  {
    rank: 'bronze',
    minXp: 1000,
    maxXp: 4999,
  },
  {
    rank: 'silver',
    minXp: 5000,
    maxXp: 14999,
  },
  {
    rank: 'gold',
    minXp: 15000,
    maxXp: 49999,
  },
  {
    rank: 'elite',
    minXp: 50000,
    maxXp: Infinity,
  },
];

export const RANK_COLORS: Record<Rank, string> = {
  rookie: '#9CA3AF',    // Gray
  bronze: '#CD7F32',    // Bronze
  silver: '#C0C0C0',    // Silver
  gold: '#FFD700',      // Gold
  elite: '#FF1493',     // Deep Pink
};

export const RANK_DESCRIPTIONS: Record<Rank, string> = {
  rookie: 'Just Getting Started',
  bronze: 'Building Momentum',
  silver: 'Serious Athlete',
  gold: 'Fitness Master',
  elite: 'Legend Status',
};

export const XP_CONFIG = {
  workoutCompleted: 100,
  exerciseCompleted: 25,
  streakBonus: 50, // per day streak
  speedBonus: (exerciseTime: number) => exerciseTime, // XP = exercise time in seconds
  goldMedalBonus: 50, // for completing ahead of schedule
};

export function getRankByXp(xp: number): Rank {
  const threshold = RANK_THRESHOLDS.find(
    (t) => xp >= t.minXp && xp <= t.maxXp
  );
  return threshold?.rank || 'elite';
}

export function getXpForNextRank(currentXp: number): number {
  const currentRank = getRankByXp(currentXp);
  const nextThreshold = RANK_THRESHOLDS.find((t) => t.rank === currentRank);
  if (!nextThreshold || nextThreshold.rank === 'elite') {
    return Infinity;
  }
  return nextThreshold.maxXp;
}

export function getXpProgress(currentXp: number): {
  current: number;
  max: number;
  percentage: number;
} {
  const currentRank = getRankByXp(currentXp);
  const currentThreshold = RANK_THRESHOLDS.find((t) => t.rank === currentRank);
  
  if (!currentThreshold) {
    return { current: 0, max: 0, percentage: 0 };
  }

  const xpInCurrentRank = currentXp - currentThreshold.minXp;
  const maxXpInCurrentRank = currentThreshold.maxXp - currentThreshold.minXp;
  const percentage = (xpInCurrentRank / maxXpInCurrentRank) * 100;

  return {
    current: xpInCurrentRank,
    max: maxXpInCurrentRank,
    percentage: Math.min(percentage, 100),
  };
}
