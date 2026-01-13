/**
 * Information theory utilities for Wordle word ranking
 * Includes feedback simulation and entropy-based scoring
 */

/**
 * Simulates Wordle feedback for a guess against a target word
 * Returns a 5-character pattern string:
 * - 'G' = green (correct letter, correct position)
 * - 'Y' = yellow (correct letter, wrong position)
 * - 'X' = gray (letter not in target, or already accounted for)
 *
 * Handles duplicate letters correctly:
 * - Green matches take priority
 * - Yellow matches are assigned left-to-right for remaining occurrences
 * - Extra duplicates are marked as gray
 *
 * @param guess - The guessed word (5 letters)
 * @param target - The target/answer word (5 letters)
 * @returns 5-character feedback pattern string
 */
export function simulateFeedback(guess: string, target: string): string {
  const result: string[] = ['X', 'X', 'X', 'X', 'X'];

  // Track which target letters have been matched
  const targetLetterCounts = new Map<string, number>();
  for (const letter of target) {
    targetLetterCounts.set(letter, (targetLetterCounts.get(letter) || 0) + 1);
  }

  // First pass: Mark all green matches (correct position)
  // These take priority over yellow matches
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'G';
      // Decrease available count for this letter
      targetLetterCounts.set(guess[i], targetLetterCounts.get(guess[i])! - 1);
    }
  }

  // Second pass: Mark yellow matches (correct letter, wrong position)
  // Only if letter exists in target and hasn't been fully matched
  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'G') {
      const letter = guess[i];
      const remainingCount = targetLetterCounts.get(letter) || 0;
      if (remainingCount > 0) {
        result[i] = 'Y';
        targetLetterCounts.set(letter, remainingCount - 1);
      }
      // Otherwise stays 'X' (gray)
    }
  }

  return result.join('');
}

/**
 * Calculate expected remaining words for a guess
 * Lower value = better guess (eliminates more words on average)
 *
 * Formula: sum(group_size^2) / total_words
 * This is the expected number of remaining words after the guess
 *
 * @param guess - The guess to evaluate
 * @param possibleWords - List of possible target words
 * @returns Expected number of remaining words
 */
export function calculateExpectedRemaining(
  guess: string,
  possibleWords: string[]
): number {
  if (possibleWords.length === 0) return 0;

  // Group words by the feedback pattern they would produce
  const patternGroups = new Map<string, number>();

  for (const target of possibleWords) {
    const pattern = simulateFeedback(guess, target);
    patternGroups.set(pattern, (patternGroups.get(pattern) || 0) + 1);
  }

  // Calculate expected remaining: sum(group_size^2) / total
  let sumSquared = 0;
  for (const groupSize of patternGroups.values()) {
    sumSquared += groupSize * groupSize;
  }

  return sumSquared / possibleWords.length;
}

/**
 * Calculate information entropy for a guess
 * Higher value = better guess (more information gained on average)
 *
 * Formula: -sum(p * log2(p)) where p = group_size / total_words
 * This is the expected bits of information gained from the guess
 *
 * @param guess - The guess to evaluate
 * @param possibleWords - List of possible target words
 * @returns Entropy in bits
 */
export function calculateEntropy(
  guess: string,
  possibleWords: string[]
): number {
  if (possibleWords.length === 0) return 0;

  // Group words by the feedback pattern they would produce
  const patternGroups = new Map<string, number>();

  for (const target of possibleWords) {
    const pattern = simulateFeedback(guess, target);
    patternGroups.set(pattern, (patternGroups.get(pattern) || 0) + 1);
  }

  // Calculate entropy: -sum(p * log2(p))
  const total = possibleWords.length;
  let entropy = 0;

  for (const groupSize of patternGroups.values()) {
    const p = groupSize / total;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  }

  return entropy;
}
