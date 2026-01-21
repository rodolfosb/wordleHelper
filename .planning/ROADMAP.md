# Roadmap: Wordle Helper

## Overview

Build a web application that helps users solve Wordle puzzles by suggesting optimal words based on their guesses and color-coded feedback. Starting with a solid foundation and word list, we'll implement constraint-based filtering, intelligent ranking algorithms, and a clean input interface that mirrors Wordle's visual feedback system.

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Phases 1-5 (shipped 2026-01-13)
- ✅ **[v1.1 Features](milestones/v1.1-ROADMAP.md)** — Phases 6-11 (shipped 2026-01-16)
- ✅ **[v1.2 Complete Experience](milestones/v1.2-ROADMAP.md)** — Phases 12-18 (shipped 2026-01-19)
- ✅ **[v1.3 Deployment](milestones/v1.3-ROADMAP.md)** — Phases 19-23 (shipped 2026-01-21)
- 🚧 **v1.4 Bug Fixes** — Phases 24-25 (in progress)

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

<details>
<summary>✅ v1.2 Complete Experience (Phases 12-18) — SHIPPED 2026-01-19</summary>

- [x] Phase 12: Header Layout (1/1 plans) — completed 2026-01-19
- [x] Phase 13: Settings Menu (1/1 plans) — completed 2026-01-19
- [x] Phase 14: Word Sync NYT (1/1 plans) — completed 2026-01-19
- [x] Phase 15: Open Mode (1/1 plans) — completed 2026-01-19
- [x] Phase 16: Keyboard Enhancements (1/1 plans) — completed 2026-01-19
- [x] Phase 17: Hints System (1/1 plans) — completed 2026-01-19
- [x] Phase 18: Internationalization (4/4 plans) — completed 2026-01-19

See [v1.2 archive](milestones/v1.2-ROADMAP.md) for full details.

</details>

<details>
<summary>✅ v1.3 Deployment (Phases 19-23) — SHIPPED 2026-01-21</summary>

- [x] Phase 19: Vercel Setup (manual) — completed 2026-01-19
- [x] Phase 20: Build Configuration (absorbed into 21) — completed 2026-01-20
- [x] Phase 21: Domain Configuration (1/1 plans) — completed 2026-01-20
- [x] Phase 22: PWA Updates (1/1 plans) — completed 2026-01-21
- [x] Phase 23: CI/CD & Cleanup (1/1 plans) — completed 2026-01-21

See [v1.3 archive](milestones/v1.3-ROADMAP.md) for full details.

</details>

### 🚧 v1.4 Bug Fixes (In Progress)

**Milestone Goal:** Fix gameplay bugs to ensure correct behavior

#### Phase 24: Input Validation Fixes

**Goal**: Enforce hard mode constraints on guess submission + prevent editing submitted rows
**Depends on**: v1.3 complete
**Research**: Unlikely (internal patterns - modifying existing guess submission logic)
**Plans**: 1

Plans:
- [x] 24-01: Hard mode validation + row locking — completed 2026-01-21

#### Phase 25: NYT Sync Fix

**Goal**: Investigate and fix puzzle date sync issue reported during Phase 21 verification
**Depends on**: Phase 24
**Research**: Likely (investigating external API behavior and timing issues)
**Research topics**: NYT puzzle API update mechanism, timezone handling, caching behavior
**Plans**: TBD

Plans:
- [ ] 25-01: TBD (run /gsd:plan-phase 25 to break down)

## Future Milestones

Future enhancements could include:
- Additional languages (Spanish, French, German)
- Achievements and badges system
- Social sharing features
- Competitive multiplayer mode

## Progress

**Execution Order:**
Phases 1-23 complete. v1.4 phases 24-25 in progress.

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
| 12. Header Layout | v1.2 | 1/1 | Complete | 2026-01-19 |
| 13. Settings Menu | v1.2 | 1/1 | Complete | 2026-01-19 |
| 14. Word Sync NYT | v1.2 | 1/1 | Complete | 2026-01-19 |
| 15. Open Mode | v1.2 | 1/1 | Complete | 2026-01-19 |
| 16. Keyboard Enhancements | v1.2 | 1/1 | Complete | 2026-01-19 |
| 17. Hints System | v1.2 | 1/1 | Complete | 2026-01-19 |
| 18. Internationalization | v1.2 | 4/4 | Complete | 2026-01-19 |
| 19. Vercel Setup | v1.3 | manual | Complete | 2026-01-19 |
| 20. Build Configuration | v1.3 | absorbed | Complete | 2026-01-20 |
| 21. Domain Configuration | v1.3 | 1/1 | Complete | 2026-01-20 |
| 22. PWA Updates | v1.3 | 1/1 | Complete | 2026-01-21 |
| 23. CI/CD & Cleanup | v1.3 | 1/1 | Complete | 2026-01-21 |
| 24. Input Validation Fixes | v1.4 | 1/1 | Complete | 2026-01-21 |
| 25. NYT Sync Fix | v1.4 | 0/? | Not started | - |

**Overall:** 24/25 phases complete (96%)
