import type { SessionStats } from '../types';

/**
 * LocalStorage key for persisting session stats
 */
export const STORAGE_KEY = 'wordle-helper-stats';

/**
 * Default stats when no data exists
 */
const DEFAULT_STATS: SessionStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

/**
 * Load stats from LocalStorage
 * Returns default stats if no data exists or data is invalid
 */
export function loadStats(): SessionStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_STATS, guessDistribution: [...DEFAULT_STATS.guessDistribution] };
    }

    const parsed = JSON.parse(stored);

    // Validate the parsed data has the expected structure
    if (
      typeof parsed.gamesPlayed === 'number' &&
      typeof parsed.gamesWon === 'number' &&
      typeof parsed.currentStreak === 'number' &&
      typeof parsed.maxStreak === 'number' &&
      Array.isArray(parsed.guessDistribution) &&
      parsed.guessDistribution.length === 6
    ) {
      return {
        gamesPlayed: parsed.gamesPlayed,
        gamesWon: parsed.gamesWon,
        currentStreak: parsed.currentStreak,
        maxStreak: parsed.maxStreak,
        guessDistribution: parsed.guessDistribution as SessionStats['guessDistribution'],
      };
    }

    // Invalid structure, return defaults
    return { ...DEFAULT_STATS, guessDistribution: [...DEFAULT_STATS.guessDistribution] };
  } catch {
    // Parse error or LocalStorage not available
    return { ...DEFAULT_STATS, guessDistribution: [...DEFAULT_STATS.guessDistribution] };
  }
}

/**
 * Save stats to LocalStorage
 */
export function saveStats(stats: SessionStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // LocalStorage not available or quota exceeded - silently fail
    console.warn('Failed to save stats to LocalStorage');
  }
}

/**
 * Record a game result and return updated stats (immutable update)
 * @param stats - Current stats
 * @param won - Whether the game was won
 * @param guesses - Number of guesses used (1-6)
 * @returns New stats object with game recorded
 */
export function recordGame(stats: SessionStats, won: boolean, guesses: number): SessionStats {
  const newDistribution = [...stats.guessDistribution] as SessionStats['guessDistribution'];

  // Update guess distribution only for wins
  if (won && guesses >= 1 && guesses <= 6) {
    newDistribution[guesses - 1]++;
  }

  // Calculate new streak
  let newCurrentStreak: number;
  let newMaxStreak: number;

  if (won) {
    newCurrentStreak = stats.currentStreak + 1;
    newMaxStreak = Math.max(stats.maxStreak, newCurrentStreak);
  } else {
    newCurrentStreak = 0;
    newMaxStreak = stats.maxStreak;
  }

  return {
    gamesPlayed: stats.gamesPlayed + 1,
    gamesWon: stats.gamesWon + (won ? 1 : 0),
    currentStreak: newCurrentStreak,
    maxStreak: newMaxStreak,
    guessDistribution: newDistribution,
  };
}

/**
 * Calculate win rate as a percentage (0-100)
 * Returns 0 if no games played
 */
export function getWinRate(stats: SessionStats): number {
  if (stats.gamesPlayed === 0) {
    return 0;
  }
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
}
