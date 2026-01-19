# Roadmap: Wordle Helper

## Overview

Build a web application that helps users solve Wordle puzzles by suggesting optimal words based on their guesses and color-coded feedback. Starting with a solid foundation and word list, we'll implement constraint-based filtering, intelligent ranking algorithms, and a clean input interface that mirrors Wordle's visual feedback system.

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Phases 1-5 (shipped 2026-01-13)
- ✅ **[v1.1 Features](milestones/v1.1-ROADMAP.md)** — Phases 6-11 (shipped 2026-01-16)
- 🚧 **v1.2 Complete Experience** — Phases 12-18 (in progress)

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

<details>
<summary>✅ v1.1 Features (Phases 6-11) — SHIPPED 2026-01-16</summary>

- [x] Phase 6: PWA Support (1/1 plans) — completed 2026-01-13
- [x] Phase 7: Hard Mode (1/1 plans) — completed 2026-01-13
- [x] Phase 8: Session Stats (1/1 plans) — completed 2026-01-15
- [x] Phase 9: Wordle History (2/2 plans) — completed 2026-01-15
- [x] Phase 10: UI Enhancements (2/2 plans) — completed 2026-01-15
- [x] Phase 11: Game Mode (1/1 plans) — completed 2026-01-16

See [v1.1 archive](milestones/v1.1-ROADMAP.md) for full details.

</details>

### 🚧 v1.2 Complete Experience (In Progress)

**Milestone Goal:** Transform from helper tool into full-featured, multilingual Wordle experience with multiple game modes and progressive hints

#### Phase 12: Header Layout
**Goal**: Restructure layout with focus on puzzle and keyboard as primary elements, add header nav with Stats/How-to-play/Settings/Language
**Depends on**: v1.1 complete
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [ ] 12-01: TBD (run /gsd:plan-phase 12 to break down)

#### Phase 13: Settings Menu
**Goal**: Consolidate settings into modal: Light/dark mode, Hard mode, NYT mode toggle, Open mode toggle, Word list visibility, Hints toggle
**Depends on**: Phase 12
**Research**: Unlikely (internal UI patterns)
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

#### Phase 14: Word Sync NYT
**Goal**: Overhaul daily word loading system, sync word lists to app, auto-add NYT words daily, implement NYT mode following official daily word
**Depends on**: Phase 13
**Research**: Unlikely (internal data handling)
**Plans**: 1

Plans:
- [ ] 14-01: JSON word data, freshness tracking, NYT mode toggle

#### Phase 15: Open Mode
**Goal**: Random word selection with unlimited replays, variable word length support (4-10 letters)
**Depends on**: Phase 14
**Research**: Unlikely (extending existing patterns)
**Plans**: TBD

Plans:
- [ ] 15-01: TBD

#### Phase 16: Keyboard Enhancements
**Goal**: Add Enter and Backspace keys to on-screen keyboard
**Depends on**: Phase 15
**Research**: Unlikely (existing keyboard component)
**Plans**: TBD

Plans:
- [ ] 16-01: TBD

#### Phase 17: Hints System
**Goal**: 6 progressive hints per word, hidden by default, revealed sequentially via visibility icon click, final hint reveals answer
**Depends on**: Phase 16
**Research**: Unlikely (internal feature)
**Plans**: TBD

Plans:
- [ ] 17-01: TBD

#### Phase 18: Internationalization
**Goal**: Language selector in header, English and Portuguese support initially, extensible architecture for more languages
**Depends on**: Phase 17
**Research**: Likely (i18n library choice, locale patterns)
**Research topics**: i18n library options for Vite/TypeScript (i18next, vue-i18n equivalent for vanilla TS), Portuguese word list sources
**Plans**: TBD

Plans:
- [ ] 18-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → ... → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18

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
| 11. Game Mode | v1.1 | 1/1 | Complete | 2026-01-16 |
| 12. Header Layout | v1.2 | 0/? | Not started | - |
| 13. Settings Menu | v1.2 | 0/? | Not started | - |
| 14. Word Sync NYT | v1.2 | 0/? | Not started | - |
| 15. Open Mode | v1.2 | 0/? | Not started | - |
| 16. Keyboard Enhancements | v1.2 | 0/? | Not started | - |
| 17. Hints System | v1.2 | 0/? | Not started | - |
| 18. Internationalization | v1.2 | 0/? | Not started | - |

**Overall:** 11/18 phases complete (61%)
