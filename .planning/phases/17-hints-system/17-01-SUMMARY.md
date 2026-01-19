---
phase: 17-hints-system
plan: 01
subsystem: ui
tags: [typescript, css, hints, game-ui]

# Dependency graph
requires:
  - phase: 15-open-mode
    provides: variable word length infrastructure
  - phase: 13-settings-modal
    provides: settings toggle pattern
provides:
  - HintsPanel component with progressive hint reveal
  - showHints setting in AppSettings
  - Settings toggle for hints visibility
affects: [future hint enhancements, game modes]

# Tech tracking
tech-stack:
  added: []
  patterns: [progressive reveal UI, eye icon toggle pattern]

key-files:
  created: [src/ui/HintsPanel.ts]
  modified: [src/main.ts, src/style.css, src/types/index.ts, src/utils/settings.ts, src/ui/SettingsModal.ts]

key-decisions:
  - "Hints panel positioned below Reset Game button, above suggestions"
  - "Sequential reveal enforced - must reveal hints in order 1-6"
  - "Eye icon changes from visibility_off to visibility on reveal"

patterns-established:
  - "Progressive reveal: sequential unlocking of content with visual indicators"
  - "Panel visibility: controlled via parent container hidden class, not panel element"

# Metrics
duration: ~25min
completed: 2026-01-19
---

# Phase 17: Hints System Summary

**Progressive hints system with 6 sequential hints (first letter, last letter, vowel count, position hints, full reveal) using eye icon toggles**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-01-19
- **Completed:** 2026-01-19
- **Tasks:** 6
- **Files modified:** 6

## Accomplishments
- HintsPanel component with generateHints() producing 6 contextual hints per word
- Settings integration with showHints toggle (default enabled)
- Sequential reveal enforced - players must reveal hints in order
- Works with variable word lengths (4-10 letters) in Open Mode

## Task Commits

Each task was committed atomically:

1. **Task 1: Add showHints setting to AppSettings** - `b7bb4e2` (feat)
2. **Task 2: Add hints toggle to SettingsModal** - `f8c8440` (feat)
3. **Task 3: Create HintsPanel component** - `8100558` (feat)
4. **Task 4: Add HintsPanel styles** - `f7cb3e7` (feat)
5. **Task 5: Integrate HintsPanel into main.ts** - `b84ea71` (feat)
6. **Task 6: Human verification checkpoint** - `5f7194c` (fix)

## Files Created/Modified
- `src/ui/HintsPanel.ts` - New component with progressive hint reveal logic
- `src/types/index.ts` - Added showHints to AppSettings interface
- `src/utils/settings.ts` - Added showHints default (true)
- `src/ui/SettingsModal.ts` - Added "Show Hints" toggle switch
- `src/style.css` - Added hints panel styling
- `src/main.ts` - Integrated HintsPanel, wired to settings and game state

## Decisions Made
- Positioned hints panel below Reset Game button, above suggestions (changed from original plan position)
- Panel visibility controlled via parent container (hints-area) hidden class, not the panel element itself

## Deviations from Plan

### Auto-fixed Issues

**1. [Fix] Hints toggle targeting wrong element**
- **Found during:** Task 6 (Human verification)
- **Issue:** Toggle was applying hidden class to hints panel element instead of hints area container
- **Fix:** Changed applySettings to toggle hidden class on hintsArea instead of hintsPanel
- **Files modified:** src/main.ts
- **Verification:** Toggle now correctly shows/hides hints panel
- **Committed in:** 5f7194c

**2. [Fix] Hints panel position adjustment**
- **Found during:** Task 6 (Human verification)
- **Issue:** Original position (below puzzle info, above grid) felt intrusive
- **Fix:** Moved hints-area insertion to after Reset Game button, before suggestions
- **Files modified:** src/main.ts
- **Verification:** Hints panel now in more appropriate location
- **Committed in:** 5f7194c

---

**Total deviations:** 2 auto-fixed (both UI/UX improvements)
**Impact on plan:** Fixes improved usability without scope creep.

## Issues Encountered
None beyond the deviations noted above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hints system complete and verified
- Ready for Phase 18 (remaining milestone phases)
- All game modes (NYT, Open, Practice) supported

---
*Phase: 17-hints-system*
*Completed: 2026-01-19*
