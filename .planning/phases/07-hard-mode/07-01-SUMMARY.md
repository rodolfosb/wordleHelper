---
phase: 07-hard-mode
plan: 01
subsystem: logic, ui
tags: [typescript, filtering, wordle, hard-mode, toggle]

# Dependency graph
requires:
  - phase: 02-core-logic
    provides: Constraints type, filterWords function, addGuessToConstraints
provides:
  - Hard mode validation function (isHardModeValid)
  - Hard mode toggle UI component
  - Real-time filtering with hard mode constraints
affects: [08-session-stats, 10-ui-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns: [toggle switch UI pattern, additional filter layer]

key-files:
  created: [src/logic/hardMode.ts]
  modified: [src/main.ts, src/style.css]

key-decisions:
  - "Hard mode filter applied AFTER regular constraint filter for layered filtering"
  - "Toggle slider uses Wordle green (#538d4e) for active state to match theme"
  - "Hard mode state resets to false on New Game for fresh start"

patterns-established:
  - "Additional filters applied as chained filter() calls in updateSuggestions"
  - "Toggle switch styling with hidden checkbox + span slider pattern"

issues-created: []

# Metrics
duration: 6min
completed: 2026-01-13
---

# Phase 7: Hard Mode Summary

**Hard mode validation function and toggle UI filtering suggestions to only show valid hard-mode guesses using green/yellow constraint reuse rules**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-13
- **Completed:** 2026-01-13
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Hard mode filter function that validates guesses against accumulated constraints
- Toggle switch UI with Wordle-green active state in controls area
- Real-time suggestion filtering when hard mode is enabled
- Proper reset of hard mode state on New Game

## Task Commits

Each task was committed atomically:

1. **Task 1: Create hard mode filter function** - `b306d2d` (feat)
2. **Task 2: Add hard mode toggle UI and integrate filter** - `a836bdf` (feat)

**Plan metadata:** `dd17b99` (docs: complete plan)

## Files Created/Modified
- `src/logic/hardMode.ts` - isHardModeValid function checking green position + yellow presence rules
- `src/main.ts` - Hard mode toggle integration, state management, updateSuggestions filtering
- `src/style.css` - Toggle switch styling with slider animation and Wordle green active state

## Decisions Made
- Hard mode filter applied after regular filterWords for clear separation of concerns
- Used standard toggle slider pattern with hidden checkbox for accessibility
- Label text changes color to green when active for visual feedback

## Deviations from Plan

None - plan executed exactly as written

## Issues Encountered
None

## Next Phase Readiness
- Hard mode feature complete, ready for Phase 8 (Session Stats)
- Hard mode state could be included in session statistics if needed
- No blockers or concerns

---
*Phase: 07-hard-mode*
*Completed: 2026-01-13*
