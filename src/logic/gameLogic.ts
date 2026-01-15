import type { LetterStatus } from '../types';

/**
 * Calculate letter statuses for a guess against the answer.
 * Implements Wordle's exact algorithm:
 * 1. Mark all exact matches (green) first
 * 2. For remaining letters, mark as yellow if letter exists in answer
 *    (but only as many times as it appears in answer minus greens)
 * 3. Everything else is gray
 */
export function calculateLetterStatuses(
  guess: string,
  answer: string
): LetterStatus[] {
  const result: LetterStatus[] = ['gray', 'gray', 'gray', 'gray', 'gray'];
  const answerChars = answer.toLowerCase().split('');
  const guessChars = guess.toLowerCase().split('');
  const answerCharCounts: Record<string, number> = {};

  // Count available letters in answer
  for (const char of answerChars) {
    answerCharCounts[char] = (answerCharCounts[char] || 0) + 1;
  }

  // First pass: mark greens (exact position matches)
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'green';
      answerCharCounts[guessChars[i]]--;
    }
  }

  // Second pass: mark yellows (letter exists but wrong position)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'green') continue; // Already matched
    const char = guessChars[i];
    if (answerCharCounts[char] && answerCharCounts[char] > 0) {
      result[i] = 'yellow';
      answerCharCounts[char]--;
    }
    // Otherwise stays gray
  }

  return result;
}
