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
