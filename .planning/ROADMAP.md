# Roadmap: Wordle Helper

## Overview

Build a web application that helps users solve Wordle puzzles by suggesting optimal words based on their guesses and color-coded feedback. Starting with a solid foundation and word list, we'll implement constraint-based filtering, intelligent ranking algorithms, and a clean input interface that mirrors Wordle's visual feedback system.

## Milestones

- ✅ **[v1.0 MVP](milestones/v1.0-ROADMAP.md)** — Phases 1-5 (shipped 2026-01-13)
- ✅ **[v1.1 Features](milestones/v1.1-ROADMAP.md)** — Phases 6-11 (shipped 2026-01-16)
- ✅ **[v1.2 Complete Experience](milestones/v1.2-ROADMAP.md)** — Phases 12-18 (shipped 2026-01-19)
- 🚧 **v1.3 Deployment** — Phases 19-23 (in progress)

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

### 🚧 v1.3 Deployment (In Progress)

**Milestone Goal:** Deploy Wordle Helper to Vercel with custom Cloudflare-managed subdomain

#### Phase 19: Vercel Setup

**Goal**: Create Vercel project and connect GitHub repository
**Depends on**: Previous milestone complete
**Research**: Unlikely (established patterns)
**Plans**: TBD

Plans:
- [ ] 19-01: TBD (run /gsd:plan-phase 19 to break down)

#### Phase 20: Build Configuration

**Goal**: Update Vite config for root path deployment (remove /wordleHelper/ base)
**Depends on**: Phase 19
**Research**: Unlikely (internal config changes)
**Plans**: TBD

Plans:
- [ ] 20-01: TBD

#### Phase 21: Domain Configuration

**Goal**: Configure custom subdomain in Vercel and set up Cloudflare DNS records
**Depends on**: Phase 20
**Research**: Likely (Cloudflare + Vercel DNS integration)
**Research topics**: Vercel custom domain setup, Cloudflare CNAME/proxy configuration, SSL certificates
**Plans**: TBD

Plans:
- [ ] 21-01: TBD

#### Phase 22: PWA Updates

**Goal**: Update PWA manifest scope, start_url, and icons for new domain
**Depends on**: Phase 21
**Research**: Unlikely (PWA manifest updates)
**Plans**: TBD

Plans:
- [ ] 22-01: TBD

#### Phase 23: CI/CD & Cleanup

**Goal**: Verify automatic deployments, remove gh-pages dependency, update documentation
**Depends on**: Phase 22
**Research**: Unlikely (standard patterns)
**Plans**: TBD

Plans:
- [ ] 23-01: TBD

## Future Milestones

Future enhancements could include:
- Additional languages (Spanish, French, German)
- Achievements and badges system
- Social sharing features
- Competitive multiplayer mode

## Progress

**Execution Order:**
Phases 1-18 complete, now: 19 → 20 → 21 → 22 → 23

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
| 19. Vercel Setup | v1.3 | 0/? | Not started | - |
| 20. Build Configuration | v1.3 | 0/? | Not started | - |
| 21. Domain Configuration | v1.3 | 0/? | Not started | - |
| 22. PWA Updates | v1.3 | 0/? | Not started | - |
| 23. CI/CD & Cleanup | v1.3 | 0/? | Not started | - |

**Overall:** 18/23 phases complete (78%)
