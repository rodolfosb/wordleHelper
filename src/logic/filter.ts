/**
 * Word filtering based on Wordle constraints
 */
import type { Constraints } from '../types';

/**
 * Filters words by prefix (for partial word filtering during typing)
 * Returns words that start with the given prefix
 */
export function filterByPrefix(words: string[], prefix: string): string[] {
  if (!prefix) return words;
  return words.filter((w) => w.startsWith(prefix));
}

/**
 * Filters a word list against accumulated constraints
 * Returns words that satisfy all constraints
 *
 * Constraint checks (in order of efficiency):
 * 1. exactPositions: word[position] must equal required letter
 * 2. excludedLetters: word must not contain excluded letters (unless in requiredLetters)
 * 3. requiredLetters: letter must appear in word, but not at excluded positions
 *
 * Important: requiredLetters takes precedence over excludedLetters
 * This handles the duplicate letter case where a letter can be both yellow and gray
 */
export function filterWords(words: string[], constraints: Constraints): string[] {
  const { exactPositions, requiredLetters, excludedLetters } = constraints;

  return words.filter((word) => {
    // Check 1: Exact positions (green letters)
    for (const [position, letter] of exactPositions) {
      if (word[position] !== letter) {
        return false;
      }
    }

    // Check 2: Excluded letters (gray letters)
    // Skip letters that are in requiredLetters (they take precedence)
    for (const letter of excludedLetters) {
      if (!requiredLetters.has(letter) && word.includes(letter)) {
        return false;
      }
    }

    // Check 3: Required letters (yellow letters)
    for (const [letter, excludedPositions] of requiredLetters) {
      // Letter must appear somewhere in the word
      if (!word.includes(letter)) {
        return false;
      }

      // Letter must NOT be at any of the excluded positions for that letter
      for (const position of excludedPositions) {
        if (word[position] === letter) {
          return false;
        }
      }
    }

    return true;
  });
}
