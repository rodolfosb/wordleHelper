---
phase: 18-internationalization
plan: 01
subsystem: data
tags: [word-lists, internationalization, typescript, i18n]

# Dependency graph
requires:
  - phase: 15-open-mode
    provides: Word length support (4-10 letters)
provides:
  - Folder-per-language word list architecture
  - Language-aware word list helper functions
  - WordLanguage type for multi-language support
  - Backward-compatible exports (WORD_LIST, getWordListForLength)
affects: [18-02-portuguese-words, 18-03-language-toggle]

# Tech tracking
tech-stack:
  added: []
  patterns: [language-folder-structure, language-prefixed-exports]

key-files:
  created:
    - src/data/words/index.ts
    - src/data/words/en/index.ts
    - src/data/words/en/words4.ts
    - src/data/words/en/words5.ts
    - src/data/words/en/words6.ts
    - src/data/words/en/words7.ts
    - src/data/words/en/words8.ts
    - src/data/words/en/words9.ts
    - src/data/words/en/words10.ts
  modified: []

key-decisions:
  - "Used WORD_LIST_EN_N naming convention for language-specific exports"
  - "Kept original export names (WORD_LIST, WORD_SET) as aliases for backward compatibility"
  - "Language filtering uses regex patterns per language (ASCII for en, accented for pt)"

patterns-established:
  - "Language folder structure: src/data/words/{lang}/words{N}.ts"
  - "Language index with helper functions: getEnglishWordList(length)"
  - "Main index with multi-language helpers: getWordListForLanguageAndLength(lang, length)"
  - "Caching layer for filtered word lists to avoid repeated filtering"

# Metrics
duration: 15min
completed: 2026-01-19
---

# Phase 18 Plan 01: Word List Architecture Summary

**Folder-per-language architecture for word lists with src/data/words/en/ structure and multi-language helper functions**

## Performance

- **Duration:** 15 min
- **Started:** 2026-01-19T13:11:54Z
- **Completed:** 2026-01-19T13:26:00Z
- **Tasks:** 4
- **Files modified:** 16 (8 created, 7 deleted, 1 modified)

## Accomplishments
- Created English word list folder structure at src/data/words/en/
- Built main words index with multi-language support and caching
- Maintained backward compatibility with existing imports
- Removed old word list files, reducing code duplication

## Task Commits

Each task was committed atomically:

1. **Task 1: Create English word list folder structure** - `19310b8` (feat)
2. **Task 2: Create main words index with language support** - `fa17430` (feat)
3. **Task 3: Update imports across codebase** - No changes needed (verified working)
4. **Task 4: Remove old word list files** - `bd9d448` (feat)

## Files Created/Modified

### Created
- `src/data/words/index.ts` - Main entry point with language-aware functions
- `src/data/words/en/index.ts` - English word list exports and helpers
- `src/data/words/en/words4.ts` - 4-letter English words
- `src/data/words/en/words5.ts` - 5-letter English words (Wordle standard)
- `src/data/words/en/words6.ts` - 6-letter English words
- `src/data/words/en/words7.ts` - 7-letter English words
- `src/data/words/en/words8.ts` - 8-letter English words
- `src/data/words/en/words9.ts` - 9-letter English words
- `src/data/words/en/words10.ts` - 10-letter English words

### Deleted
- `src/data/words.ts` - Old 5-letter word list (moved to en/words5.ts)
- `src/data/words4.ts` through `src/data/words10.ts` - Old word lists

## Decisions Made
- Used re-export aliasing to maintain both new naming (WORD_LIST_EN_5) and old naming (WORD_LIST)
- Implemented caching layer for filtered word lists to ensure filtering only happens once per language/length combination
- Added WordLanguage type with 'en' and 'pt' for type safety

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Architecture ready for Portuguese word lists in 18-02
- getWordListForLanguageAndLength already handles 'pt' language with fallback
- Just need to add src/data/words/pt/ folder and word files

---
*Phase: 18-internationalization*
*Plan: 01*
*Completed: 2026-01-19*
