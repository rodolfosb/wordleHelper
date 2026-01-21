---
phase: 24-input-validation-fixes
plan: FIX
subsystem: gameplay
tags: [hard-mode, validation, wordle]

# Dependency graph
requires:
  - phase: 24-01
    provides: hard mode validation implementation
provides:
  - Fixed hard mode validation that correctly handles first guess
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: ["constraint building from previous rows only"]

key-files:
  created: []
  modified: ["src/main.ts"]

key-decisions:
  - "Build constraints only from rows before current row to avoid validating against uncolored current row"

patterns-established:
  - "Row-based iteration (prevRow < row) instead of getAllFeedback() for constraint building in validation"

# Metrics
duration: 1min
completed: 2026-01-21
---

# Phase 24 FIX: Hard Mode Validation Fix Summary

**Fixed hard mode to allow first guess by validating only against PREVIOUS rows, not the current uncolored row**

## Performance

- **Duration:** 1 min
- **Started:** 2026-01-21T16:12:26Z
- **Completed:** 2026-01-21T16:12:57Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Fixed UAT-001 blocker: hard mode now correctly allows first guess
- Hard mode validates against constraints from rows 0 to currentRow-1 only
- First guess (row 0) has empty constraints, allowing any valid word
- Subsequent guesses properly validate against colored feedback from prior rows

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix UAT-001 - Hard mode blocks first guess** - `b9ef82a` (fix)

## Files Created/Modified
- `src/main.ts` - Changed hard mode validation to build constraints only from rows BEFORE the current row

## Decisions Made
- Use explicit row-based loop (prevRow < row) instead of getAllFeedback() to ensure only previously colored rows contribute to constraints

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UAT-001 blocker resolved
- Ready for re-verification with /gsd:verify-work 24
- If verification passes, ready for Phase 25 (NYT Sync Fix)

---
*Phase: 24-input-validation-fixes*
*Completed: 2026-01-21*
