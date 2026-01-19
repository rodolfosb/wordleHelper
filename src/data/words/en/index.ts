/**
 * English word lists index
 * Re-exports all English word lists for easy importing
 */

// Re-export with language-specific naming
export { WORD_LIST as WORD_LIST_EN_5, WORD_SET as WORD_SET_EN_5 } from "./words5";
export { WORD_LIST_4 as WORD_LIST_EN_4, WORD_SET_4 as WORD_SET_EN_4 } from "./words4";
export { WORD_LIST_6 as WORD_LIST_EN_6, WORD_SET_6 as WORD_SET_EN_6 } from "./words6";
export { WORD_LIST_7 as WORD_LIST_EN_7, WORD_SET_7 as WORD_SET_EN_7 } from "./words7";
export { WORD_LIST_8 as WORD_LIST_EN_8, WORD_SET_8 as WORD_SET_EN_8 } from "./words8";
export { WORD_LIST_9 as WORD_LIST_EN_9, WORD_SET_9 as WORD_SET_EN_9 } from "./words9";
export { WORD_LIST_10 as WORD_LIST_EN_10, WORD_SET_10 as WORD_SET_EN_10 } from "./words10";

// Import for helper functions
import { WORD_LIST as WORD_LIST_EN_5, WORD_SET as WORD_SET_EN_5 } from "./words5";
import { WORD_LIST_4 as WORD_LIST_EN_4, WORD_SET_4 as WORD_SET_EN_4 } from "./words4";
import { WORD_LIST_6 as WORD_LIST_EN_6, WORD_SET_6 as WORD_SET_EN_6 } from "./words6";
import { WORD_LIST_7 as WORD_LIST_EN_7, WORD_SET_7 as WORD_SET_EN_7 } from "./words7";
import { WORD_LIST_8 as WORD_LIST_EN_8, WORD_SET_8 as WORD_SET_EN_8 } from "./words8";
import { WORD_LIST_9 as WORD_LIST_EN_9, WORD_SET_9 as WORD_SET_EN_9 } from "./words9";
import { WORD_LIST_10 as WORD_LIST_EN_10, WORD_SET_10 as WORD_SET_EN_10 } from "./words10";

/**
 * Get English word list for a given length
 */
export function getEnglishWordList(length: number): string[] {
  switch (length) {
    case 4:
      return WORD_LIST_EN_4;
    case 5:
      return WORD_LIST_EN_5;
    case 6:
      return WORD_LIST_EN_6;
    case 7:
      return WORD_LIST_EN_7;
    case 8:
      return WORD_LIST_EN_8;
    case 9:
      return WORD_LIST_EN_9;
    case 10:
      return WORD_LIST_EN_10;
    default:
      return WORD_LIST_EN_5;
  }
}

/**
 * Get English word set for a given length (O(1) lookup)
 */
export function getEnglishWordSet(length: number): Set<string> {
  switch (length) {
    case 4:
      return WORD_SET_EN_4;
    case 5:
      return WORD_SET_EN_5;
    case 6:
      return WORD_SET_EN_6;
    case 7:
      return WORD_SET_EN_7;
    case 8:
      return WORD_SET_EN_8;
    case 9:
      return WORD_SET_EN_9;
    case 10:
      return WORD_SET_EN_10;
    default:
      return WORD_SET_EN_5;
  }
}
