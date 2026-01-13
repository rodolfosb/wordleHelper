/**
 * Constraint building from Wordle guess feedback
 */
import type { Constraints, GuessFeedback } from '../types';

/**
 * Creates an empty constraints object
 * Factory function for initializing constraints state
 */
export function createEmptyConstraints(): Constraints {
  return {
    exactPositions: new Map(),
    requiredLetters: new Map(),
    excludedLetters: new Set(),
  };
}

/**
 * Processes a guess and updates constraints based on feedback
 * Returns a new Constraints object (immutable pattern)
 *
 * Important edge case: A letter can be both YELLOW/GREEN and GRAY in the same guess
 * (e.g., word "APPLE" guessed against "ALLOT" - first L is yellow, second L is gray).
 * Only add to excludedLetters if the letter has NO green or yellow instances in the guess.
 */
export function addGuessToConstraints(
  constraints: Constraints,
  guess: GuessFeedback
): Constraints {
  // Create new Maps/Sets for immutability
  const exactPositions = new Map(constraints.exactPositions);
  const requiredLetters = new Map(
    Array.from(constraints.requiredLetters.entries()).map(([letter, positions]) => [
      letter,
      new Set(positions),
    ])
  );
  const excludedLetters = new Set(constraints.excludedLetters);

  // First pass: collect all letters that have green or yellow status
  // These should NOT be added to excludedLetters even if they also appear as gray
  const lettersWithHits = new Set<string>();

  for (const feedback of guess) {
    if (feedback.status === 'green' || feedback.status === 'yellow') {
      lettersWithHits.add(feedback.letter);
    }
  }

  // Second pass: process each letter feedback
  for (const feedback of guess) {
    const { letter, position, status } = feedback;

    switch (status) {
      case 'green':
        // Letter is in correct position
        exactPositions.set(position, letter);
        break;

      case 'yellow':
        // Letter is in word but not at this position
        if (!requiredLetters.has(letter)) {
          requiredLetters.set(letter, new Set());
        }
        requiredLetters.get(letter)!.add(position);
        break;

      case 'gray':
        // Only exclude if letter has no green/yellow instances in this guess
        if (!lettersWithHits.has(letter)) {
          excludedLetters.add(letter);
        }
        break;
    }
  }

  return {
    exactPositions,
    requiredLetters,
    excludedLetters,
  };
}
