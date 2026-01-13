/**
 * Combined word ranking system for Wordle
 * Balances entropy-based information gain with letter frequency scoring
 */

import type { RankingOptions, RankedWord } from '../types';
import { calculateEntropy } from './entropy';
import { calculateLetterFrequencies, scoreWordByFrequency } from './frequency';

/**
 * Default threshold for enabling entropy calculation
 * Beyond this, entropy becomes too slow for real-time usage
 */
const ENTROPY_THRESHOLD = 500;

/**
 * Default weights for combining scores
 */
const DEFAULT_ENTROPY_WEIGHT = 0.7;
const DEFAULT_FREQUENCY_WEIGHT = 0.3;

/**
 * Ranks words using a combination of entropy and frequency scoring
 *
 * Algorithm:
 * 1. If possibleTargets > 500 and useEntropy not explicitly true, use frequency only (performance)
 * 2. Calculate entropy score for each candidate (normalize to 0-1)
 * 3. Calculate frequency score for each candidate (normalize to 0-1)
 * 4. Combined score = (entropyWeight * entropyScore) + (frequencyWeight * frequencyScore)
 * 5. Sort by combined score descending
 *
 * @param candidates - Words to rank (could be same as possibleTargets or include all valid guesses)
 * @param possibleTargets - Current possible answer words (filtered by constraints)
 * @param options - Ranking configuration
 * @returns Sorted array of ranked words with scores
 */
export function rankWords(
  candidates: string[],
  possibleTargets: string[],
  options?: RankingOptions
): RankedWord[] {
  if (candidates.length === 0) return [];

  // Determine whether to use entropy based on word count and options
  const shouldUseEntropy =
    options?.useEntropy ?? possibleTargets.length <= ENTROPY_THRESHOLD;
  const shouldUseFrequency = options?.useFrequency ?? true;

  // Get weights (must sum to 1 for proper normalization)
  const entropyWeight = options?.entropyWeight ?? DEFAULT_ENTROPY_WEIGHT;
  const frequencyWeight = options?.frequencyWeight ?? DEFAULT_FREQUENCY_WEIGHT;

  // If neither scoring method is enabled, return words in original order
  if (!shouldUseEntropy && !shouldUseFrequency) {
    return candidates.map((word) => ({ word, score: 0 }));
  }

  // Calculate raw scores for all candidates
  const rawScores: { word: string; entropy: number; frequency: number }[] = [];

  // Pre-calculate frequencies if needed
  const frequencies = shouldUseFrequency
    ? calculateLetterFrequencies(possibleTargets)
    : null;

  for (const word of candidates) {
    const entropy = shouldUseEntropy
      ? calculateEntropy(word, possibleTargets)
      : 0;
    const frequency = frequencies ? scoreWordByFrequency(word, frequencies) : 0;

    rawScores.push({ word, entropy, frequency });
  }

  // Find min/max for normalization
  let minEntropy = Infinity,
    maxEntropy = -Infinity;
  let minFrequency = Infinity,
    maxFrequency = -Infinity;

  for (const { entropy, frequency } of rawScores) {
    if (shouldUseEntropy) {
      minEntropy = Math.min(minEntropy, entropy);
      maxEntropy = Math.max(maxEntropy, entropy);
    }
    if (shouldUseFrequency) {
      minFrequency = Math.min(minFrequency, frequency);
      maxFrequency = Math.max(maxFrequency, frequency);
    }
  }

  // Normalize and combine scores
  const rankedWords: RankedWord[] = rawScores.map(
    ({ word, entropy, frequency }) => {
      // Normalize to 0-1 range (handle edge case where all values are the same)
      const entropyNorm =
        shouldUseEntropy && maxEntropy > minEntropy
          ? (entropy - minEntropy) / (maxEntropy - minEntropy)
          : entropy > 0
            ? 1
            : 0;

      const frequencyNorm =
        shouldUseFrequency && maxFrequency > minFrequency
          ? (frequency - minFrequency) / (maxFrequency - minFrequency)
          : frequency > 0
            ? 1
            : 0;

      // Calculate combined score based on which methods are enabled
      let score: number;
      if (shouldUseEntropy && shouldUseFrequency) {
        score = entropyWeight * entropyNorm + frequencyWeight * frequencyNorm;
      } else if (shouldUseEntropy) {
        score = entropyNorm;
      } else {
        score = frequencyNorm;
      }

      return {
        word,
        score,
        entropyScore: shouldUseEntropy ? entropyNorm : undefined,
        frequencyScore: shouldUseFrequency ? frequencyNorm : undefined,
      };
    }
  );

  // Sort by score descending
  rankedWords.sort((a, b) => b.score - a.score);

  return rankedWords;
}
