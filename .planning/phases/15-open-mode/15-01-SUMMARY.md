---
phase: 15-open-mode
plan: 01
subsystem: ui, game-logic
tags: [word-lists, settings, random-selection, variable-length]

# Dependency graph
requires:
  - phase: 14-word-sync-nyt
    provides: NYT mode toggle, settings infrastructure, word data storage
provides:
  - Word lists for 4-10 letter words
  - wordLength setting (4-10, default 5)
  - Word length selector in settings (disabled in NYT mode)
  - Variable column GuessGrid
  - Random word selection for Open Mode
  - Unlimited replayable Open Mode games
affects: [16-i18n, future word-related features]

# Tech tracking
tech-stack:
  added: []
  patterns: [variable-length word lists, dynamic grid columns, mode-specific settings]

key-files:
  created: []
  modified: [src/data/words.ts, src/types/index.ts, src/utils/settings.ts, src/ui/SettingsModal.ts, src/ui/GuessGrid.ts, src/main.ts, src/style.css, src/logic/filter.ts]

key-decisions:
  - "Word lists curated for puzzle-friendly common words (500-800 for shorter, 150-300 for longer)"
  - "Word length selector disabled when NYT mode on (NYT always 5 letters)"
  - "Grid uses CSS custom property --word-length for dynamic columns"
  - "Open Mode uses synthetic HistoricalPuzzle with game: -1"

patterns-established:
  - "getWordListForLength()/getWordSetForLength() for length-aware word access"
  - "Mode-specific UI disabling (selector disabled when mode not applicable)"

# Metrics
duration: ~20min
completed: 2026-01-19
---

# Phase 15: Open Mode Summary

**Open Mode with random word selection supporting 4-10 letter games, unlimited replayability**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-01-19
- **Completed:** 2026-01-19
- **Tasks:** 5 auto + 2 fixes
- **Files modified:** 8

## Accomplishments

- Word lists for all lengths 4-10 with helper functions for access
- Word length selector in settings (disabled when NYT mode active)
- GuessGrid dynamically resizes for variable word lengths
- Open Mode selects random words with unlimited reset/replay
- Letter status tracking updated for variable word lengths

## Task Commits

Each task was committed atomically:

1. **Task 1: Add word lists for variable lengths** - `8dc329b` (feat)
2. **Task 2: Add wordLength setting** - `07a8786` (feat)
3. **Task 3: Add word length selector to settings** - `7072c57` (feat)
4. **Task 4: Update GuessGrid for variable lengths** - `60eb831` (feat)
5. **Task 5: Implement Open Mode game flow** - `19aa0e4` (feat)
6. **Fix: Filter word lists correctly** - `29ec196` (fix)
7. **Fix: Support variable word lengths in letter status** - `d889777` (fix)

## Files Created/Modified

- `src/data/words.ts` - Word lists for lengths 4-10 with getWordListForLength/getWordSetForLength helpers
- `src/types/index.ts` - Added wordLength to AppSettings
- `src/utils/settings.ts` - Default wordLength: 5
- `src/ui/SettingsModal.ts` - Word length selector dropdown, disabled in NYT mode
- `src/ui/GuessGrid.ts` - setWordLength() method, dynamic column rendering
- `src/main.ts` - selectRandomWord(), Open Mode game flow, reset generates new word
- `src/style.css` - CSS custom property --word-length for grid columns
- `src/logic/filter.ts` - Updated to use correct word list for current length

## Decisions Made

- Word lists contain common, puzzle-friendly words (avoiding obscure/offensive)
- Shorter lengths have more words (500-800), longer lengths fewer (150-300)
- Grid columns use CSS custom property for responsive sizing
- Open Mode synthetic puzzle uses game: -1 to distinguish from real NYT puzzles

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Filter word lists to ensure correct length**
- **Found during:** Checkpoint verification
- **Issue:** Some filtering operations used wrong word list for current length
- **Fix:** Updated filter.ts to use getWordListForLength(appSettings.wordLength)
- **Files modified:** src/logic/filter.ts
- **Verification:** Filtering returns words of correct length in Open Mode
- **Committed in:** 29ec196

**2. [Rule 2 - Missing Critical] Support variable word lengths in letter status**
- **Found during:** Checkpoint verification
- **Issue:** Letter status tracking assumed 5-letter words
- **Fix:** Updated status logic to use current word length
- **Files modified:** src/logic/filter.ts (or related)
- **Verification:** Letter status works correctly for all word lengths
- **Committed in:** d889777

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Both fixes necessary for correct functionality with variable lengths. No scope creep.

## Issues Encountered

None beyond auto-fixed issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Open Mode fully functional with variable word lengths
- Ready for UAT testing of Open Mode features
- Phase 16 (i18n) can proceed - will need Portuguese word lists for each length

---
*Phase: 15-open-mode*
*Completed: 2026-01-19*
