import type { HistoricalPuzzle } from '../types';
import { findByDate, getFirstDate, getLastDate, WORDLE_ANSWERS } from './wordleAnswers';

/**
 * Get puzzle by date from embedded data
 *
 * Uses local lookup from embedded WORDLE_ANSWERS array.
 * No external API calls - eliminates CORS issues.
 *
 * @param date - Date string in "YYYY-MM-DD" format
 * @returns Promise resolving to puzzle data or null if not found
 */
export async function getPuzzleByDate(date: string): Promise<HistoricalPuzzle | null> {
  const entry = findByDate(date);

  if (!entry) {
    return null;
  }

  return {
    game: entry.game,
    date: entry.date,
    answer: entry.answer,
  };
}

/**
 * Get the maximum selectable date
 *
 * Returns the earlier of: yesterday OR last date in embedded data.
 * This ensures we don't spoil today's puzzle and stay within data range.
 *
 * @returns Date string in "YYYY-MM-DD" format
 */
export function getMaxDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const lastDataDate = getLastDate();

  // Return the earlier date
  return yesterdayStr < lastDataDate ? yesterdayStr : lastDataDate;
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
 * Returns null if today's date is not in the data.
 *
 * @returns HistoricalPuzzle or null if not found
 */
export function getTodaysPuzzle(): HistoricalPuzzle | null {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  const entry = findByDate(dateStr);
  if (!entry) {
    // If today's date not in data, get the most recent puzzle
    const lastEntry = WORDLE_ANSWERS[WORDLE_ANSWERS.length - 1];
    if (lastEntry) {
      return {
        game: lastEntry.game,
        date: lastEntry.date,
        answer: lastEntry.answer,
      };
    }
    return null;
  }

  return {
    game: entry.game,
    date: entry.date,
    answer: entry.answer,
  };
}
