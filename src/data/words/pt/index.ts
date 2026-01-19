/**
 * Portuguese word lists
 * Source: IME-USP Brazilian Portuguese Dictionary
 * https://www.ime.usp.br/~pf/dicios/
 * License: CC BY
 */

// Export all word lists
export { WORD_LIST_PT_4, WORD_SET_PT_4 } from "./words4";
export { WORD_LIST_PT_5, WORD_SET_PT_5 } from "./words5";
export { WORD_LIST_PT_6, WORD_SET_PT_6 } from "./words6";
export { WORD_LIST_PT_7, WORD_SET_PT_7 } from "./words7";
export { WORD_LIST_PT_8, WORD_SET_PT_8 } from "./words8";
export { WORD_LIST_PT_9, WORD_SET_PT_9 } from "./words9";
export { WORD_LIST_PT_10, WORD_SET_PT_10 } from "./words10";

import { WORD_LIST_PT_4, WORD_SET_PT_4 } from "./words4";
import { WORD_LIST_PT_5, WORD_SET_PT_5 } from "./words5";
import { WORD_LIST_PT_6, WORD_SET_PT_6 } from "./words6";
import { WORD_LIST_PT_7, WORD_SET_PT_7 } from "./words7";
import { WORD_LIST_PT_8, WORD_SET_PT_8 } from "./words8";
import { WORD_LIST_PT_9, WORD_SET_PT_9 } from "./words9";
import { WORD_LIST_PT_10, WORD_SET_PT_10 } from "./words10";

/**
 * Get Portuguese word list for a given length
 */
export function getPortugueseWordList(length: number): string[] {
  switch (length) {
    case 4:
      return WORD_LIST_PT_4;
    case 5:
      return WORD_LIST_PT_5;
    case 6:
      return WORD_LIST_PT_6;
    case 7:
      return WORD_LIST_PT_7;
    case 8:
      return WORD_LIST_PT_8;
    case 9:
      return WORD_LIST_PT_9;
    case 10:
      return WORD_LIST_PT_10;
    default:
      return WORD_LIST_PT_5;
  }
}

/**
 * Get Portuguese word set for a given length (O(1) lookup)
 */
export function getPortugueseWordSet(length: number): Set<string> {
  switch (length) {
    case 4:
      return WORD_SET_PT_4;
    case 5:
      return WORD_SET_PT_5;
    case 6:
      return WORD_SET_PT_6;
    case 7:
      return WORD_SET_PT_7;
    case 8:
      return WORD_SET_PT_8;
    case 9:
      return WORD_SET_PT_9;
    case 10:
      return WORD_SET_PT_10;
    default:
      return WORD_SET_PT_5;
  }
}
