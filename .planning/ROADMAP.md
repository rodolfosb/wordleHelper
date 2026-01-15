# Roadmap: Wordle Helper

## Overview

Build a web application that helps users solve Wordle puzzles by suggesting optimal words based on their guesses and color-coded feedback. Starting with a solid foundation and word list, we'll implement constraint-based filtering, intelligent ranking algorithms, and a clean input interface that mirrors Wordle's visual feedback system.

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Phases 1-5 (shipped 2026-01-13)
- 🚧 **v1.1 Features** — Phases 6-10 (in progress)

## Completed Milestones

<details>
<summary>✅ v1.0 MVP (Phases 1-5) — SHIPPED 2026-01-13</summary>

- [x] Phase 1: Foundation (1/1 plans) — completed 2026-01-13
- [x] Phase 2: Core Logic (1/1 plans) — completed 2026-01-13
- [x] Phase 3: Ranking System (2/2 plans) — completed 2026-01-13
- [x] Phase 4: User Interface (4/4 plans) — completed 2026-01-13
- [x] Phase 5: Polish (1/1 plans) — completed 2026-01-13

See [v1.0 archive](milestones/v1.0-ROADMAP.md) for full details.

</details>

### 🚧 v1.1 Features (In Progress)

**Milestone Goal:** Add PWA support, hard mode, session statistics, historical Wordle words, and UI enhancements.

#### Phase 6: PWA Support — Complete

**Goal**: Make the app installable and work offline with service worker and web manifest
**Depends on**: v1.0 complete
**Completed**: 2026-01-13

Plans:
- [x] 06-01: PWA with vite-plugin-pwa, service worker, manifest, icons

#### Phase 7: Hard Mode — Complete

**Goal**: Implement Wordle hard mode rules that filter suggestions to only valid hard-mode guesses
**Depends on**: Phase 6
**Completed**: 2026-01-13

Plans:
- [x] 07-01: Hard mode filter function and toggle UI

#### Phase 8: Session Stats — Complete

**Goal**: Track and display game statistics (games played, win rate, guess distribution) with LocalStorage persistence
**Depends on**: Phase 7
**Completed**: 2026-01-15

Plans:
- [x] 08-01: Stats types, LocalStorage persistence, modal UI, game flow integration

#### Phase 9: Wordle History — Complete

**Goal**: Integrate historical Wordle words from previous days, allowing users to practice with past puzzles
**Depends on**: Phase 8
**Completed**: 2026-01-15

Plans:
- [x] 09-01: History types, data module with NYT/WordleHints APIs, HistoryPicker UI, practice mode integration

#### Phase 10: UI Enhancements — Complete

**Goal**: Add keyboard hint display, click-to-insert suggestions, and light/dark mode toggle
**Depends on**: Phase 9
**Research**: No (internal patterns)
**Completed**: 2026-01-15

Plans:
- [x] 10-01: Keyboard hint display + click-to-insert suggestions
- [x] 10-02: Light/dark mode toggle with persistence

#### Phase 11: Game Mode

**Goal**: Convert app from helper tool to playable Wordle game with auto-revealing colors
**Depends on**: Phase 10
**Research**: No (internal patterns)

Plans:
- [ ] 11-01: Game logic, GuessGrid updates, daily puzzle loading, practice mode integration

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 1/1 | Complete | 2026-01-13 |
| 2. Core Logic | v1.0 | 1/1 | Complete | 2026-01-13 |
| 3. Ranking System | v1.0 | 2/2 | Complete | 2026-01-13 |
| 4. User Interface | v1.0 | 4/4 | Complete | 2026-01-13 |
| 5. Polish | v1.0 | 1/1 | Complete | 2026-01-13 |
| 6. PWA Support | v1.1 | 1/1 | Complete | 2026-01-13 |
| 7. Hard Mode | v1.1 | 1/1 | Complete | 2026-01-13 |
| 8. Session Stats | v1.1 | 1/1 | Complete | 2026-01-15 |
| 9. Wordle History | v1.1 | 1/1 | Complete | 2026-01-15 |
| 10. UI Enhancements | v1.1 | 2/2 | Complete | 2026-01-15 |
| 11. Game Mode | v1.1 | 0/1 | Not started | - |

**Overall:** 10/11 phases complete (91%)
