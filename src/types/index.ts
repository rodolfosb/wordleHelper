/**
 * Core types for Wordle domain
 */

/**
 * Letter feedback status from Wordle
 * - green: correct letter in correct position
 * - yellow: correct letter in wrong position
 * - gray: letter not in word
 */
export type LetterStatus = 'green' | 'yellow' | 'gray';

/**
 * A single letter with its position and feedback
 */
export interface LetterFeedback {
  letter: string;      // lowercase a-z
  position: number;    // 0-4
  status: LetterStatus;
}

/**
 * A complete guess (5 letters with feedback)
 */
export type GuessFeedback = [
  LetterFeedback,
  LetterFeedback,
  LetterFeedback,
  LetterFeedback,
  LetterFeedback
];

/**
 * Accumulated constraints from all guesses
 */
export interface Constraints {
  // Letters known to be in exact positions (green)
  exactPositions: Map<number, string>;  // position -> letter

  // Letters known to be in word but not in these positions (yellow)
  requiredLetters: Map<string, Set<number>>;  // letter -> excluded positions

  // Letters known to not be in word at all (gray)
  excludedLetters: Set<string>;
}

/**
 * Options for word ranking algorithm
 */
export interface RankingOptions {
  useEntropy?: boolean;      // default: true when possibleTargets.length <= 500
  useFrequency?: boolean;    // default: true
  entropyWeight?: number;    // default: 0.7
  frequencyWeight?: number;  // default: 0.3
}

/**
 * A word with its ranking scores
 */
export interface RankedWord {
  word: string;
  score: number;
  entropyScore?: number;
  frequencyScore?: number;
}

/**
 * Session statistics for tracking user performance
 */
export interface SessionStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: [number, number, number, number, number, number]; // 6 elements for guesses 1-6
}

/**
 * A historical Wordle puzzle from the archive
 */
export interface HistoricalPuzzle {
  game: number;      // Puzzle number (1 = first official)
  date: string;      // "YYYY-MM-DD" format
  answer: string;    // lowercase 5-letter word
}

/**
 * Result from getTodaysPuzzle() indicating if this is today's actual puzzle
 * or a fallback to the most recent available puzzle
 */
export interface TodaysPuzzleResult {
  puzzle: HistoricalPuzzle;
  isFallback: boolean;  // true if today's date wasn't found, using most recent instead
}

/**
 * Application settings that persist to localStorage
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  showSuggestions: boolean;
  hardMode: boolean;
}
