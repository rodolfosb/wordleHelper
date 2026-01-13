/**
 * Hard mode validation for Wordle guesses
 *
 * In Wordle hard mode, all subsequent guesses must:
 * 1. Use green letters in their exact positions
 * 2. Include all yellow letters somewhere in the word
 */
import type { Constraints } from '../types';

/**
 * Checks if a word is a valid hard mode guess given accumulated constraints
 *
 * Rules:
 * 1. For each exactPositions entry: word[position] must equal the required letter
 * 2. For each requiredLetters entry: word must contain the letter
 *
 * Note: excludedLetters are NOT relevant for hard mode - those constrain the ANSWER, not valid GUESSES.
 *
 * @param word - The candidate word to check
 * @param constraints - Accumulated constraints from previous guesses
 * @returns true if the word is a valid hard mode guess
 */
export function isHardModeValid(word: string, constraints: Constraints): boolean {
  const { exactPositions, requiredLetters } = constraints;

  // Check 1: Green letters must be in exact positions
  for (const [position, letter] of exactPositions) {
    if (word[position] !== letter) {
      return false;
    }
  }

  // Check 2: Yellow letters must appear somewhere in the word
  for (const letter of requiredLetters.keys()) {
    if (!word.includes(letter)) {
      return false;
    }
  }

  return true;
}
