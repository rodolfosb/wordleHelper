# Discovery: Phase 18 - Internationalization (Word Lists)

**Discovery Level:** 2 (Standard Research)
**Duration:** ~10 min
**Date:** 2026-01-19

## Scope Clarification

**User Decision:** Focus on adding Portuguese words for gameplay, not UI translation.

**Feature:** Language selector in Open Mode allowing users to choose between English and Portuguese word lists.

## Portuguese Word List Source

**Primary Source:** [Gpossas/Termo GitHub Repository](https://github.com/Gpossas/Termo)
- File: `br-utf8.txt-5-letras.txt`
- Word count: ~6,016 five-letter Portuguese words
- Source origin: https://www.ime.usp.br/~pf/dicios/
- Format: UTF-8 encoded text, one word per line

**Considerations:**
- Words include accented characters (á, é, í, ó, ú, ã, õ, ç, etc.)
- Need to handle character validation in grid input
- Keyboard display needs to show Portuguese letters

## Architecture Decision

### Word List Organization

Current structure (English only):
```
src/data/
  words.ts      # 5-letter English (2,309 words)
  words4.ts     # 4-letter English
  words6.ts     # 6-letter English
  ... (7, 8, 9, 10)
```

Proposed structure (English + Portuguese):
```
src/data/
  words/
    en/
      words5.ts   # 5-letter English (move from words.ts)
      words4.ts   # 4-letter English (move existing)
      ... (6, 7, 8, 9, 10)
    pt/
      words5.ts   # 5-letter Portuguese (~6,000 words)
```

**Alternative (simpler):** Keep existing structure, add Portuguese as new files:
```
src/data/
  words.ts           # English 5-letter (existing)
  words4.ts          # English 4-letter (existing)
  ...
  wordsPt5.ts        # Portuguese 5-letter (new)
```

**Decision:** Use simpler approach - add `wordsPt5.ts` alongside existing files. Avoids restructuring working code.

### Language Setting

Add `wordLanguage: 'en' | 'pt'` to AppSettings:
- Default: 'en'
- Only affects Open Mode (NYT Mode always uses English)
- Persisted in localStorage with other settings

### UI Changes

1. **Settings Modal**: Add "Word Language" dropdown (English / Português)
   - Only enabled when NYT Mode is OFF
   - Shows description: "Language for Open Mode words"

2. **Puzzle Info**: Show language indicator
   - "Open Mode (5 letters) - English"
   - "Open Mode (5 letters) - Português"

3. **Keyboard**: When Portuguese selected, need to support accented characters
   - Option A: Add accent row to keyboard
   - Option B: Support typing accents via key combinations
   - **Decision:** Option B - simpler, keeps keyboard layout consistent

### Character Handling

Portuguese characters to support:
- Vowels with accents: á, à, â, ã, é, ê, í, ó, ô, õ, ú
- Cedilla: ç

**Keyboard input approach:**
- Physical keyboard: Accept accented characters directly
- On-screen keyboard: User types base letter, word validation handles accents
- Alternative: Normalize accents for matching (risky - changes game difficulty)

**Decision:** Accept accented characters in input. Grid cells display exactly what user types. Validation uses Portuguese word list with accents.

### Word Length Support

Portuguese word lists available:
- 5 letters: Yes (~6,000 words from Termo)
- 4, 6, 7, 8, 9, 10 letters: Not readily available

**Decision for Phase 18:** Portuguese support for 5-letter words only.
- When Portuguese selected + word length ≠ 5, show warning or auto-switch to English
- Or: Disable word length selector when Portuguese selected (like NYT Mode)

**Simpler approach:** When Portuguese selected, word length is fixed at 5. This mirrors how Termo works.

## Implementation Summary

### Files to Create
- `src/data/wordsPt5.ts` - Portuguese 5-letter word list

### Files to Modify
- `src/types/index.ts` - Add `wordLanguage` to AppSettings
- `src/utils/settings.ts` - Add default for wordLanguage
- `src/ui/SettingsModal.ts` - Add language dropdown
- `src/data/words.ts` - Add `getWordListForLanguage()` helper
- `src/main.ts` - Use language setting in Open Mode, update puzzle info

### Scope Constraints

**In scope:**
- Portuguese 5-letter word list (~6,000 words)
- Language selector in Settings (English / Português)
- Language setting persisted in localStorage
- Open Mode uses selected language
- Word length fixed to 5 when Portuguese selected

**Out of scope:**
- Portuguese word lists for lengths 4, 6, 7, 8, 9, 10
- UI translation (labels, buttons, messages stay English)
- Keyboard layout changes for accented characters
- NYT Mode with Portuguese (NYT puzzles are English)
