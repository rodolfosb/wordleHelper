/**
 * Letter frequency analysis and word scoring for Wordle
 */

/**
 * Calculate total letter frequencies across all words
 * Counts each occurrence of each letter (a-z)
 *
 * @param words - Array of words to analyze
 * @returns Map of letter -> total count
 */
export function calculateLetterFrequencies(words: string[]): Map<string, number> {
  const frequencies = new Map<string, number>();

  // Initialize all letters to 0
  for (let i = 0; i < 26; i++) {
    frequencies.set(String.fromCharCode(97 + i), 0);
  }

  // Count occurrences
  for (const word of words) {
    for (const letter of word) {
      const count = frequencies.get(letter) || 0;
      frequencies.set(letter, count + 1);
    }
  }

  return frequencies;
}

/**
 * Calculate letter frequencies by position
 * For each position (0-4), counts letter occurrences at that specific position
 *
 * @param words - Array of 5-letter words to analyze
 * @returns Array of 5 Maps, each mapping letter -> count at that position
 */
export function calculatePositionalFrequencies(
  words: string[]
): Map<string, number>[] {
  const positionalMaps: Map<string, number>[] = [];

  // Initialize 5 maps (one for each position)
  for (let pos = 0; pos < 5; pos++) {
    const posMap = new Map<string, number>();
    // Initialize all letters to 0
    for (let i = 0; i < 26; i++) {
      posMap.set(String.fromCharCode(97 + i), 0);
    }
    positionalMaps.push(posMap);
  }

  // Count occurrences by position
  for (const word of words) {
    for (let pos = 0; pos < word.length && pos < 5; pos++) {
      const letter = word[pos];
      const posMap = positionalMaps[pos];
      const count = posMap.get(letter) || 0;
      posMap.set(letter, count + 1);
    }
  }

  return positionalMaps;
}

/**
 * Score a word based on letter frequencies
 * Sums frequency scores for each UNIQUE letter in the word
 * Using unique letters rewards diversity (e.g., "crane" > "geese")
 *
 * @param word - The word to score
 * @param frequencies - Map of letter -> frequency count
 * @returns Total score (sum of frequencies for unique letters)
 */
export function scoreWordByFrequency(
  word: string,
  frequencies: Map<string, number>
): number {
  const uniqueLetters = new Set(word);
  let score = 0;

  for (const letter of uniqueLetters) {
    score += frequencies.get(letter) || 0;
  }

  return score;
}

/**
 * Rank words by letter frequency score
 * Calculates frequencies from baseWordList, scores each word, returns sorted by score
 *
 * @param words - Words to rank
 * @param baseWordList - Word list to calculate frequencies from (typically WORD_LIST)
 * @returns Words sorted by frequency score (descending)
 */
export function rankWordsByFrequency(
  words: string[],
  baseWordList: string[]
): string[] {
  const frequencies = calculateLetterFrequencies(baseWordList);

  // Create array with scores for sorting
  const wordsWithScores = words.map((word) => ({
    word,
    score: scoreWordByFrequency(word, frequencies),
  }));

  // Sort by score descending
  wordsWithScores.sort((a, b) => b.score - a.score);

  // Return just the words
  return wordsWithScores.map((ws) => ws.word);
}
