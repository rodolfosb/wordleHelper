/**
 * NYT Wordle API client for fetching daily puzzle answers.
 * Uses the official NYT API endpoint to get the current day's answer.
 * Falls back to embedded data if the API is unavailable.
 */

import type { WordleAnswer } from '../data/wordleAnswers';
import { findByDate } from '../data/wordleAnswers';

const NYT_API_BASE = 'https://www.nytimes.com/svc/wordle/v2';
const CACHE_KEY = 'wordle-nyt-cache';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour cache

interface NYTWordleResponse {
  id: number;
  solution: string;
  print_date: string;
  days_since_launch: number;
  editor: string;
}

interface CachedAnswer {
  date: string;
  answer: string;
  game: number;
  fetchedAt: number;
}

/**
 * Format a date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get cached answer from localStorage
 */
function getCachedAnswer(date: string): CachedAnswer | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedAnswer = JSON.parse(cached);

    // Check if cache is for the requested date and still fresh
    if (data.date === date && Date.now() - data.fetchedAt < CACHE_DURATION_MS) {
      return data;
    }
  } catch (e) {
    console.warn('Failed to read NYT cache:', e);
  }
  return null;
}

/**
 * Save answer to localStorage cache
 */
function cacheAnswer(answer: CachedAnswer): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(answer));
  } catch (e) {
    console.warn('Failed to cache NYT answer:', e);
  }
}

/**
 * Fetch today's Wordle answer from the NYT API
 */
export async function fetchTodaysAnswer(): Promise<WordleAnswer | null> {
  const today = new Date();
  const dateStr = formatDate(today);

  // Check cache first
  const cached = getCachedAnswer(dateStr);
  if (cached) {
    return {
      date: cached.date,
      answer: cached.answer,
      game: cached.game,
    };
  }

  // Try to fetch from NYT API
  try {
    const url = `${NYT_API_BASE}/${dateStr}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: NYTWordleResponse = await response.json();

    const answer: WordleAnswer = {
      date: data.print_date,
      answer: data.solution.toLowerCase(),
      game: data.days_since_launch,
    };

    // Cache the result
    cacheAnswer({
      date: answer.date,
      answer: answer.answer,
      game: answer.game,
      fetchedAt: Date.now(),
    });

    return answer;
  } catch (e) {
    console.warn('Failed to fetch from NYT API, falling back to embedded data:', e);

    // Fall back to embedded data
    return findByDate(dateStr) || null;
  }
}

/**
 * Fetch a specific date's Wordle answer from the NYT API
 */
export async function fetchAnswerByDate(date: string): Promise<WordleAnswer | null> {
  // Check cache first (only for today's date)
  const cached = getCachedAnswer(date);
  if (cached) {
    return {
      date: cached.date,
      answer: cached.answer,
      game: cached.game,
    };
  }

  // Try to fetch from NYT API
  try {
    const url = `${NYT_API_BASE}/${date}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: NYTWordleResponse = await response.json();

    return {
      date: data.print_date,
      answer: data.solution.toLowerCase(),
      game: data.days_since_launch,
    };
  } catch (e) {
    console.warn(`Failed to fetch ${date} from NYT API, falling back to embedded data:`, e);

    // Fall back to embedded data
    return findByDate(date) || null;
  }
}

/**
 * Check if the NYT API is available
 */
export async function isNYTApiAvailable(): Promise<boolean> {
  try {
    const today = formatDate(new Date());
    const url = `${NYT_API_BASE}/${today}.json`;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
