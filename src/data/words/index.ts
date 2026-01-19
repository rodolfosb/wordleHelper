/**
 * Word list module - provides word lists for multiple languages
 *
 * Supported languages:
 * - en: English (4-10 letter words)
 * - pt: Portuguese (coming in 18-02)
 */

// Re-export English word lists and helpers
export * from "./en";

// Type for supported languages
export type WordLanguage = "en" | "pt";

// Import English helpers
import { getEnglishWordList } from "./en";

// Cache for filtered word lists (ensures ASCII-only filtering once per length)
const filteredWordListCache: Map<string, string[]> = new Map();
const filteredWordSetCache: Map<string, Set<string>> = new Map();

/**
 * Get the word list for a given language and word length
 * @param language - 'en' or 'pt'
 * @param length - Word length (4-10)
 * @returns Array of words
 */
export function getWordListForLanguageAndLength(
  language: WordLanguage,
  length: number
): string[] {
  const cacheKey = `${language}-${length}`;

  if (filteredWordListCache.has(cacheKey)) {
    return filteredWordListCache.get(cacheKey)!;
  }

  let rawList: string[];

  if (language === "pt") {
    // Portuguese - will be added in 18-02, fall back to English for now
    rawList = getEnglishWordList(length);
  } else {
    rawList = getEnglishWordList(length);
  }

  // Filter to ensure correct length and valid characters
  // For English: ASCII lowercase only
  // For Portuguese: will include accented chars
  const validChars = language === "pt" ? /^[a-záàâãéêíóôõúç]+$/ : /^[a-z]+$/;
  const filtered = rawList.filter(
    (word) => word.length === length && validChars.test(word)
  );

  filteredWordListCache.set(cacheKey, filtered);
  return filtered;
}

/**
 * Get the word set for a given language and word length (O(1) lookup)
 * @param language - 'en' or 'pt'
 * @param length - Word length (4-10)
 * @returns Set of words
 */
export function getWordSetForLanguageAndLength(
  language: WordLanguage,
  length: number
): Set<string> {
  const cacheKey = `${language}-${length}`;

  if (filteredWordSetCache.has(cacheKey)) {
    return filteredWordSetCache.get(cacheKey)!;
  }

  const wordList = getWordListForLanguageAndLength(language, length);
  const wordSet = new Set(wordList);

  filteredWordSetCache.set(cacheKey, wordSet);
  return wordSet;
}

// Backward compatibility aliases
export { WORD_LIST_EN_5 as WORD_LIST } from "./en";
export { WORD_SET_EN_5 as WORD_SET } from "./en";

/**
 * Get the word list for a given length (English only - backward compat)
 * @deprecated Use getWordListForLanguageAndLength instead
 */
export function getWordListForLength(length: number): string[] {
  return getWordListForLanguageAndLength("en", length);
}

/**
 * Get the word set for a given length (English only - backward compat)
 * @deprecated Use getWordSetForLanguageAndLength instead
 */
export function getWordSetForLength(length: number): Set<string> {
  return getWordSetForLanguageAndLength("en", length);
}
