/**
 * Historical Wordle answers loaded from JSON asset.
 * The JSON file can be updated independently without modifying TypeScript code.
 *
 * Data source: Official NYT Wordle answers archive
 * Range: Game #0 (2021-06-19) through current
 */

import wordleData from './wordleAnswers.json';

export interface WordleAnswer {
  game: number;
  date: string;
  answer: string;
}

// Type the imported JSON data
export const WORDLE_ANSWERS: WordleAnswer[] = wordleData as WordleAnswer[];

/**
 * Get the first available date in the embedded data
 */
export function getFirstDate(): string {
  return WORDLE_ANSWERS[0].date;
}

/**
 * Get the last available date in the embedded data
 */
export function getLastDate(): string {
  return WORDLE_ANSWERS[WORDLE_ANSWERS.length - 1].date;
}

/**
 * Find a puzzle by exact date match
 */
export function findByDate(date: string): WordleAnswer | undefined {
  return WORDLE_ANSWERS.find((entry) => entry.date === date);
}

/**
 * Find a puzzle by game number
 */
export function findByGame(game: number): WordleAnswer | undefined {
  return WORDLE_ANSWERS.find((entry) => entry.game === game);
}

/**
 * Calculate the number of days since the last entry in the data
 * @returns Number of days since the last puzzle in the data
 */
export function getDataAge(): number {
  const lastDate = getLastDate();
  const lastDateObj = new Date(lastDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - lastDateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Check if the puzzle data is stale (more than 1 day old)
 * @returns true if the data is more than 1 day behind today
 */
export function isDataStale(): boolean {
  return getDataAge() > 1;
}

/**
 * Get the count of missing puzzles since the last entry
 * @returns Number of puzzles missing from today back to last entry
 */
export function getMissingPuzzleCount(): number {
  return getDataAge();
}
