import type { HistoricalPuzzle } from '../types';

/**
 * Cache configuration for historical puzzle data
 */
const CACHE_KEY_PREFIX = 'wordle-history-';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * First official Wordle puzzle date
 */
const WORDLE_START_DATE = '2021-06-19';

/**
 * Cached puzzle data structure
 */
interface CachedHistory {
  puzzle: HistoricalPuzzle | null;
  fetchedAt: number;
}

/**
 * NYT API response type
 */
interface NYTWordleResponse {
  id: number;
  solution: string;
  print_date: string;
  days_since_launch: number;
  editor: string;
}

/**
 * WordleHints API response type
 */
interface WordleHintsResponse {
  answer: string;
  date: string;
  game: number;
}

/**
 * Get the cache key for a specific date
 */
function getCacheKey(date: string): string {
  return `${CACHE_KEY_PREFIX}${date}`;
}

/**
 * Get cached puzzle data for a date if valid
 */
function getCachedPuzzle(date: string): HistoricalPuzzle | null {
  const cacheKey = getCacheKey(date);
  const cached = localStorage.getItem(cacheKey);

  if (!cached) return null;

  try {
    const { puzzle, fetchedAt } = JSON.parse(cached) as CachedHistory;

    // Check if cache is still fresh
    if (Date.now() - fetchedAt < CACHE_TTL) {
      return puzzle;
    }
  } catch {
    // Invalid cache data, ignore
  }

  return null;
}

/**
 * Cache puzzle data for a date
 */
function cachePuzzle(date: string, puzzle: HistoricalPuzzle | null): void {
  const cacheKey = getCacheKey(date);
  const cacheData: CachedHistory = {
    puzzle,
    fetchedAt: Date.now(),
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch {
    // LocalStorage full or unavailable, ignore
  }
}

/**
 * Fetch puzzle from NYT API
 */
async function fetchFromNYT(date: string): Promise<HistoricalPuzzle | null> {
  const url = `https://www.nytimes.com/svc/wordle/v2/${date}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data: NYTWordleResponse = await response.json();
    return {
      game: data.id,
      date: data.print_date,
      answer: data.solution.toLowerCase(),
    };
  } catch {
    return null;
  }
}

/**
 * Fetch puzzle from WordleHints API (fallback)
 */
async function fetchFromWordleHints(date: string): Promise<HistoricalPuzzle | null> {
  const url = `https://wordlehints.co.uk/wp-json/wordlehint/v1/answers?date=${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data: WordleHintsResponse = await response.json();
    return {
      game: data.game,
      date: data.date,
      answer: data.answer.toLowerCase(), // WordleHints returns UPPERCASE
    };
  } catch {
    return null;
  }
}

/**
 * Get puzzle by date
 *
 * Checks cache first, then fetches from NYT API.
 * Falls back to WordleHints API if NYT fails.
 *
 * @param date - Date string in "YYYY-MM-DD" format
 * @returns Promise resolving to puzzle data or null if not found
 */
export async function getPuzzleByDate(date: string): Promise<HistoricalPuzzle | null> {
  // Check cache first
  const cached = getCachedPuzzle(date);
  if (cached !== null) {
    return cached;
  }

  // Try NYT API first
  let puzzle = await fetchFromNYT(date);

  // Fall back to WordleHints if NYT fails
  if (!puzzle) {
    puzzle = await fetchFromWordleHints(date);
  }

  // Cache the result (even if null to avoid repeated failed requests)
  cachePuzzle(date, puzzle);

  return puzzle;
}

/**
 * Get the maximum selectable date (yesterday)
 *
 * Returns yesterday to avoid spoiling today's puzzle.
 *
 * @returns Date string in "YYYY-MM-DD" format
 */
export function getMaxDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Get the minimum selectable date (first Wordle puzzle)
 *
 * @returns Date string in "YYYY-MM-DD" format
 */
export function getMinDate(): string {
  return WORDLE_START_DATE;
}
