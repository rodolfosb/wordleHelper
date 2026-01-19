---
phase: 14-word-sync-nyt
plan: 01
subsystem: data
tags: [json, wordle, nyt, settings, puzzle-sync]

# Dependency graph
requires:
  - phase: 13-settings-menu
    provides: Settings modal and persistence infrastructure
provides:
  - JSON-based word answer storage
  - Data freshness tracking functions
  - Stale data warning UI
  - NYT mode toggle setting
affects: [word-updates, future-sync-features]

# Tech tracking
tech-stack:
  added: []
  patterns: [json-import, data-freshness-tracking]

key-files:
  created: [src/data/wordleAnswers.json]
  modified: [src/data/wordleAnswers.ts, src/data/history.ts, src/types/index.ts, src/main.ts, src/utils/settings.ts, src/ui/SettingsModal.ts, src/style.css]

key-decisions:
  - "Word data stored as JSON file for independent updates"
  - "Stale data threshold set to >1 day"
  - "NYT mode defaults to true"
  - "Open mode disables game mode auto-color reveal"

patterns-established:
  - "Data freshness: getDataAge(), isDataStale(), getMissingPuzzleCount() pattern"
  - "Mode toggle: nytMode setting triggers game reinit on change"

# Metrics
duration: 5min
completed: 2026-01-19
---

# Phase 14: Word Sync NYT Summary

**JSON-based word storage with data freshness tracking and NYT mode toggle for flexible puzzle play modes**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-19T09:51:39Z
- **Completed:** 2026-01-19T09:56:20Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- Converted 1672 word entries from embedded TypeScript to separate JSON file
- Added data freshness tracking with clear warning when puzzle data is outdated
- Implemented NYT mode toggle allowing users to switch between daily puzzle and open mode

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert word answers to JSON format** - `09ffcef` (feat)
2. **Task 2: Add data freshness tracking and notification** - `2aa9b9c` (feat)
3. **Task 3: Add NYT mode toggle to settings** - `c712cdb` (feat)

## Files Created/Modified
- `src/data/wordleAnswers.json` - 1672 word entries as JSON array
- `src/data/wordleAnswers.ts` - Now imports JSON, exports typed array with freshness functions
- `src/data/history.ts` - Returns dataStale flag in TodaysPuzzleResult
- `src/types/index.ts` - Added dataStale to TodaysPuzzleResult, nytMode to AppSettings
- `src/utils/settings.ts` - Added nytMode: true default
- `src/ui/SettingsModal.ts` - Added NYT Mode toggle switch
- `src/main.ts` - Respects nytMode, shows stale warning, reinits on mode change
- `src/style.css` - Added stale-data-warning styling

## Decisions Made
- **JSON format:** Vite handles JSON imports natively, no additional configuration needed
- **Stale threshold:** >1 day chosen to account for timezone differences while catching outdated data
- **Mode change behavior:** Reset game and exit practice mode when toggling NYT mode
- **Warning display:** Yellow/amber banner matching Wordle's color palette for present letters

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Data architecture now supports independent JSON updates
- Settings infrastructure ready for additional game options
- Phase 14 plan 02+ can build on freshness tracking for future sync features

---
*Phase: 14-word-sync-nyt*
*Completed: 2026-01-19*
