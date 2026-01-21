---
phase: 24-input-validation-fixes
plan: 01
subsystem: game-logic
tags: [wordle, validation, hard-mode, input]

# Dependency graph
requires:
  - phase: 06-hard-mode-suggestions
    provides: hard mode setting and constraint-based filtering
provides:
  - satisfiesConstraints function for hard mode validation
  - row submission tracking to prevent editing submitted rows
  - hard mode guess enforcement with error messages
affects: [gameplay, validation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "submitted row tracking via Set<number>"
    - "constraint satisfaction validation"

key-files:
  created: []
  modified:
    - src/logic/constraints.ts
    - src/main.ts
    - src/ui/GuessGrid.ts

key-decisions:
  - "Validate hard mode on submission (not during typing) for UX"
  - "Mark rows submitted immediately after setRowColors for instant protection"

patterns-established:
  - "Hard mode validation uses same constraint logic as suggestions filtering"

# Metrics
duration: 3min
completed: 2026-01-21
---

# Phase 24 Plan 01: Input Validation Fixes Summary

**Hard mode guess validation enforced with error messages, and submitted rows locked from backspace editing**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-21T15:51:39Z
- **Completed:** 2026-01-21T15:54:20Z
- **Tasks:** 4
- **Files modified:** 3

## Accomplishments

- Added `satisfiesConstraints()` function to validate guesses against accumulated constraints
- Enforced hard mode validation on guess submission with "Hard mode: must use revealed hints" error
- Implemented row submission tracking to prevent backspace from editing submitted rows
- Integrated `markRowSubmitted()` call after successful guess to lock rows immediately

## Task Commits

Each task was committed atomically:

1. **Task 1: Add satisfiesConstraints function to constraints.ts** - `9b90405` (feat)
2. **Task 2: Add hard mode validation to guess submission** - `e7daa6a` (feat)
3. **Task 3: Prevent editing submitted rows via backspace** - `6efbadb` (feat)
4. **Task 4: Call markRowSubmitted after successful guess** - `b402282` (feat)

## Files Created/Modified

- `src/logic/constraints.ts` - Added satisfiesConstraints() function for hard mode validation
- `src/main.ts` - Added hard mode check in onSubmit callback, call markRowSubmitted after colors set
- `src/ui/GuessGrid.ts` - Added submittedRows Set and markRowSubmitted() method, modified deleteLetter()

## Decisions Made

- **Validate hard mode on submission (not during typing)** - Better UX allows user to type any word then see error
- **Mark rows submitted immediately after setRowColors** - Protects row from editing before animation completes

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hard mode validation complete and working
- Row locking prevents editing submitted rows
- Ready for Phase 25 (NYT puzzle sync investigation)

---
*Phase: 24-input-validation-fixes*
*Completed: 2026-01-21*
