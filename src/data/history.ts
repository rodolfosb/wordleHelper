import type { HistoricalPuzzle, TodaysPuzzleResult } from '../types';
import { getFirstDate, WORDLE_ANSWERS } from './wordleAnswers';

// Wordle #0 was June 19, 2021
const WORDLE_EPOCH = new Date('2021-06-19T00:00:00');

/**
 * Calculate the puzzle number for a given date.
 * Puzzle #0 was June 19, 2021. Each subsequent day increments by 1.
 *
 * @param date - Date string in "YYYY-MM-DD" format
 * @returns The puzzle number for that date
 */
export function calculatePuzzleNumber(date: string): number {
  const targetDate = new Date(date + 'T00:00:00');
  const diffTime = targetDate.getTime() - WORDLE_EPOCH.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get puzzle by date from embedded data
 *
 * Uses local lookup from embedded WORDLE_ANSWERS array.
 * No external API calls - eliminates CORS issues.
 * The puzzle number is calculated from the date (deterministic).
 * If the answer isn't in our embedded data, returns null.
 *
 * @param date - Date string in "YYYY-MM-DD" format
 * @returns Promise resolving to puzzle data or null if not found
 */
export async function getPuzzleByDate(date: string): Promise<HistoricalPuzzle | null> {
  // Calculate the puzzle number from the date
  const puzzleNumber = calculatePuzzleNumber(date);

  // Look up the answer in our embedded data by game number
  const entry = WORDLE_ANSWERS.find((e) => e.game === puzzleNumber);

  if (!entry) {
    // We have the puzzle number but not the answer in our data
    // Return null - we can't play without knowing the answer
    return null;
  }

  return {
    game: puzzleNumber,
    date: date,
    answer: entry.answer,
  };
}

/**
 * Get the maximum selectable date
 *
 * Returns today's date. Users can select any date from the first Wordle
 * (June 19, 2021) up to today. The date picker doesn't need to be limited
 * by our embedded data - we'll show an error if a puzzle isn't found.
 *
 * @returns Date string in "YYYY-MM-DD" format
 */
export function getMaxDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get the minimum selectable date (first Wordle puzzle in embedded data)
 *
 * @returns Date string in "YYYY-MM-DD" format
 */
export function getMinDate(): string {
  return getFirstDate();
}

/**
 * Get today's puzzle from embedded data
 *
 * Synchronous lookup since data is embedded in bundle.
 * The puzzle number is always calculated correctly from the date.
 * If the answer for today's puzzle isn't in our data, returns a fallback.
 *
 * @returns TodaysPuzzleResult with puzzle and fallback indicator, or null if no data
 */
export function getTodaysPuzzle(): TodaysPuzzleResult | null {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // Calculate today's puzzle number (always correct based on date)
  const puzzleNumber = calculatePuzzleNumber(dateStr);

  // Look up the answer in our embedded data
  const entry = WORDLE_ANSWERS.find((e) => e.game === puzzleNumber);

  if (!entry) {
    // Today's puzzle isn't in our data - use the most recent puzzle we have
    const lastEntry = WORDLE_ANSWERS[WORDLE_ANSWERS.length - 1];
    if (lastEntry) {
      return {
        puzzle: {
          game: lastEntry.game,
          date: lastEntry.date,
          answer: lastEntry.answer,
        },
        isFallback: true,
      };
    }
    return null;
  }

  return {
    puzzle: {
      game: puzzleNumber,
      date: dateStr,
      answer: entry.answer,
    },
    isFallback: false,
  };
}
