# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-16)

**Core value:** A complete Wordle experience that works anywhere—play daily puzzles, practice past games, track your stats, and get intelligent word suggestions when stuck.
**Current focus:** v1.2 Complete Experience — transform into full-featured, multilingual Wordle with multiple game modes

## Current Position

Phase: 17 of 18 (Hints System)
Plan: 01 complete
Status: Phase complete - Progressive hints system with 6 sequential hints
Last activity: 2026-01-19 — Phase 17 Plan 01 complete

Progress: █████████░ 94%

## Performance Metrics

**Velocity:**
- Total plans completed: 21 (v1.0: 9, v1.1: 8, v1.2: 4)
- Average duration: ~10 min
- Total execution time: ~214 min

**By Milestone:**

| Milestone | Phases | Plans | Timeline |
|-----------|--------|-------|----------|
| v1.0 MVP | 1-5 | 9 | 2026-01-13 |
| v1.1 Features | 6-11 | 8 | 2026-01-13 → 2026-01-16 |
| v1.2 Complete Experience | 12-18 | TBD | 2026-01-16 → |

## Accumulated Context

### Decisions

All key decisions logged in PROJECT.md Key Decisions table with outcomes marked.
See milestone archives for historical decisions:
- milestones/v1.0-ROADMAP.md
- milestones/v1.1-ROADMAP.md

**Phase 12-01:**
- Header position at top of page with left-aligned title, right-aligned icons
- Puzzle info (mode + puzzle number) placed above grid instead of in header
- On-screen keyboard made clickable for mobile users

**Phase 13-01:**
- Settings stored in single localStorage key 'wordle-helper-settings'
- Theme toggle moved from header into settings modal
- CSS-only toggle switches (40x24px pill-shaped)

**Phase 14-01:**
- Word data stored as JSON file for independent updates (src/data/wordleAnswers.json)
- Data freshness tracking: getDataAge(), isDataStale(), getMissingPuzzleCount()
- Stale data threshold >1 day, warning displayed with amber styling
- NYT mode defaults to true, toggle in settings
- Open mode disables game mode auto-color reveal

**Phase 15-01:**
- Word lists for lengths 4-10 with getWordListForLength/getWordSetForLength helpers
- Word length selector disabled when NYT mode active (NYT always 5 letters)
- Grid uses CSS custom property --word-length for dynamic columns
- Open Mode synthetic puzzle uses game: -1 to distinguish from real puzzles

**Phase 16-01:**
- Enter and Backspace keys already implemented in Phase 12 (header-layout)
- No code changes required - verification only confirmed existing implementation

**Phase 17-01:**
- HintsPanel positioned below Reset Game button, above suggestions (changed from original plan)
- Panel visibility controlled via parent container hidden class, not panel element
- Sequential reveal enforced (must reveal hints 1-6 in order)

### Deferred Issues

None.

### Pending Todos

- **Hard mode guess validation** — Suggestions filter correctly, but guess submission doesn't enforce constraints. Need: `satisfiesConstraints()` function + validation in `guessGrid.onSubmit()` callback (src/main.ts:376). Show error "Hard mode: must use revealed hints" when violated.

### Blockers/Concerns

**From milestone context:**
- Word lists need Portuguese words for i18n support
- ~~Variable word length (4-10) requires word lists for each length~~ (ADDRESSED: Phase 15-01)
- ~~NYT word auto-sync mechanism needs to handle daily updates reliably~~ (ADDRESSED: JSON now updatable independently)
- Hard mode guess validation missing (tracked in Pending Todos above)

### Roadmap Evolution

- v1.0 MVP shipped 2026-01-13 (Phases 1-5)
- v1.1 Features shipped 2026-01-16 (Phases 6-11)
- Milestone v1.2 created: Complete Experience, 7 phases (Phase 12-18)

## Session Continuity

Last session: 2026-01-19
Stopped at: Phase 17 Plan 01 complete, ready for Phase 18
Resume file: None
