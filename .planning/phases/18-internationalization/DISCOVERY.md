# Discovery: Phase 18 - Internationalization (Word Lists)

**Discovery Level:** 2 (Standard Research)
**Duration:** ~15 min
**Date:** 2026-01-19

## Scope Clarification

**User Decision:**
- Word lists for **all lengths (4-10)** for both English and Portuguese
- Architecture designed for **future language additions**
- Keyboard with **long-press accent support** for language-specific characters

**Feature:** Language selector in Open Mode allowing users to choose between English and Portuguese word lists, with keyboard support for accented characters.

## Portuguese Word List Source

**Primary Source:** [IME-USP Dictionary](https://www.ime.usp.br/~pf/dicios/)
- File: `br-utf8.txt` (comprehensive Brazilian Portuguese dictionary)
- Format: UTF-8 encoded text, one word per line
- License: Creative Commons Attribution (CC BY)
- Filter by length to generate 4, 5, 6, 7, 8, 9, 10 letter word lists

**Estimated Word Counts by Length:**

| Length | Estimated Count |
|--------|-----------------|
| 4 letters | 2,000 - 5,000 |
| 5 letters | 5,000 - 10,000 |
| 6 letters | 8,000 - 15,000 |
| 7 letters | 10,000 - 20,000 |
| 8 letters | 12,000 - 25,000 |
| 9 letters | 10,000 - 20,000 |
| 10 letters | 8,000 - 18,000 |

**Portuguese Characters:**
- Vowels with accents: á, à, â, ã, é, ê, í, ó, ô, õ, ú
- Cedilla: ç

## Architecture Decision

### Word List Organization

**Current structure (flat, English only):**
```
src/data/
  words.ts      # 5-letter English (2,309 words) + helper functions
  words4.ts     # 4-letter English
  words6.ts     # 6-letter English
  ... (7, 8, 9, 10)
```

**New structure (folder per language):**
```
src/data/
  words/
    index.ts       # Re-exports, types, helper functions
    en/
      index.ts     # English exports
      words4.ts    # 4-letter English
      words5.ts    # 5-letter English (moved from words.ts)
      words6.ts    # 6-letter English
      words7.ts
      words8.ts
      words9.ts
      words10.ts
    pt/
      index.ts     # Portuguese exports
      words4.ts    # 4-letter Portuguese
      words5.ts    # 5-letter Portuguese
      words6.ts    # 6-letter Portuguese
      words7.ts
      words8.ts
      words9.ts
      words10.ts
```

**Benefits:**
- Clean separation by language
- Easy to add new languages (es/, fr/, de/, etc.)
- Each language folder has consistent structure
- Single import point via `src/data/words/index.ts`

### Language Setting

Add `wordLanguage: 'en' | 'pt'` to AppSettings:
- Default: 'en'
- Only affects Open Mode (NYT Mode always uses English)
- Persisted in localStorage with other settings

### Keyboard Enhancement: Long-Press Accents

**Approach:** Hold a key to show accent popup

1. **Detection:** Track pointer/touch duration on letter keys
2. **Popup:** After 500ms hold, show accent options above the key
3. **Selection:**
   - Drag to desired accent and release
   - Or tap accent option
4. **Accent Map by Language:**

```typescript
const ACCENT_MAP: Record<string, Record<string, string[]>> = {
  pt: {
    a: ['á', 'à', 'â', 'ã'],
    e: ['é', 'ê'],
    i: ['í'],
    o: ['ó', 'ô', 'õ'],
    u: ['ú'],
    c: ['ç'],
  },
  // Future: add es, fr, de, etc.
};
```

5. **Physical keyboard:** Accept accented characters directly (no change needed)

### UI Changes

1. **Settings Modal**: Add "Word Language" dropdown (English / Português)
   - Only enabled when NYT Mode is OFF
   - Shows description: "Language for Open Mode words"

2. **Puzzle Info**: Show language indicator
   - "Open Mode (5 letters) - English"
   - "Open Mode (5 letters) - Português"

3. **Keyboard**: Long-press accent popup for on-screen keyboard

## Implementation Plan

### Plan 18-01: Restructure Word List Architecture (Wave 1)
- Create new folder structure `src/data/words/`
- Move English word files to `src/data/words/en/`
- Create index files with helper functions
- Update all imports across codebase
- Maintain backward compatibility during transition

### Plan 18-02: Add Portuguese Word Lists (Wave 2)
- Fetch IME-USP dictionary
- Filter and generate Portuguese word files for lengths 4-10
- Create `src/data/words/pt/` with all word files
- Add Portuguese exports to main index

### Plan 18-03: Keyboard Long-Press Accent Support (Wave 2)
- Add hold detection to Keyboard component
- Create accent popup UI
- Implement accent map for Portuguese
- Handle touch and mouse interactions
- Style accent popup

### Plan 18-04: UI Integration (Wave 3)
- Add `wordLanguage` to AppSettings
- Add language selector to SettingsModal
- Update word validation to use language
- Update Open Mode to use language setting
- Update puzzle info display

## Scope Summary

**In scope:**
- Word lists for 4-10 letter words in English and Portuguese
- Folder-per-language architecture for future extensibility
- Language selector in Settings (English / Português)
- Long-press accent keyboard support
- Language setting persisted in localStorage
- Open Mode uses selected language

**Out of scope:**
- UI translation (labels, buttons, messages stay English)
- NYT Mode with other languages (NYT puzzles are English)
- Additional languages beyond Portuguese (future phases)
