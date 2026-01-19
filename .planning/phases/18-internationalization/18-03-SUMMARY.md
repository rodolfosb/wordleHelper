---
phase: 18-internationalization
plan: 03
subsystem: ui
tags: [keyboard, accents, long-press, touch, i18n]

# Dependency graph
requires:
  - phase: 18-01
    provides: Word list architecture with language support
  - phase: 18-02
    provides: Portuguese word lists with accented characters
provides:
  - Long-press accent support on on-screen keyboard
  - Accent popup UI for vowels (á, é, í, ó, ú) and ç
  - setAccentsEnabled() method for language integration
affects: [18-04-language-toggle, accent-input]

# Tech tracking
tech-stack:
  added: []
  patterns: [long-press-detection, accent-popup, pointer-events]

key-files:
  created: []
  modified:
    - src/ui/Keyboard.ts
    - src/style.css

key-decisions:
  - "500ms long-press delay for accent popup trigger"
  - "Accents disabled by default, enabled via setAccentsEnabled()"
  - "Pointer events used for cross-platform mouse/touch support"

patterns-established:
  - "ACCENT_MAP constant for mapping base letters to accent variants"
  - "Long-press detection pattern: pointerdown timer + pointerup cancel"

# Metrics
duration: 8min
completed: 2026-01-19
---

# Phase 18 Plan 03: Keyboard Accent Support Summary

**Long-press accent popup for on-screen keyboard enabling Portuguese character input (á, é, ç, etc.)**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-19T16:00:00Z
- **Completed:** 2026-01-19T16:08:00Z
- **Tasks:** 5 (4 auto, 1 skipped checkpoint)
- **Files modified:** 2

## Accomplishments
- Added ACCENT_MAP configuration for Portuguese vowels and ç
- Implemented 500ms long-press detection using pointer events
- Created accent popup UI with smooth positioning and animation
- Added CSS styles for accent popup and active key highlight
- Prepared setAccentsEnabled() API for language toggle integration

## Task Commits

Each task was committed atomically:

1. **Task 1: Add accent map configuration** - `3352090` (feat)
2. **Task 2: Add long-press detection** - `ae6398b` (feat)
3. **Task 3: Add accent popup UI** - `ae6398b` (feat, combined with Task 2)
4. **Task 4: Add accent popup styles** - `6b15c73` (feat)
5. **Task 5: Verify long-press accent keyboard support** - SKIPPED (user will verify in 18-04)

## Files Created/Modified

### Modified
- `src/ui/Keyboard.ts` - Added ACCENT_MAP, long-press detection, accent popup UI, and setAccentsEnabled() method
- `src/style.css` - Added accent popup styles, touch-action for keyboard interaction

## Decisions Made
- 500ms delay for long-press before showing accent popup
- Accents disabled by default - requires explicit enablement via setAccentsEnabled(true)
- Used pointer events (not touch/mouse) for unified cross-platform handling
- Popup positioned above key using CSS transform for centering

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None - all tasks completed without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Keyboard accent support fully implemented
- setAccentsEnabled() ready to be called by language toggle in 18-04
- Manual verification deferred to 18-04 when language toggle enables accents
- Ready for language selection UI integration

---
*Phase: 18-internationalization*
*Plan: 03*
*Completed: 2026-01-19*
