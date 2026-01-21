# Wordle Helper

## What This Is

A full-featured multilingual Wordle game with intelligent word suggestions, deployed at wordle.brdk.cc. Play NYT daily puzzles, practice with 1,671 historical puzzles, or enjoy Open Mode with random words in variable lengths (4-10 letters). Supports English and Portuguese with accented character input. Progressive hints help when stuck. Works offline as an installable PWA.

## Core Value

A complete Wordle experience that works anywhere—play daily or historical puzzles, practice in multiple languages with variable word lengths, track your stats, and get progressive hints when stuck.

## Requirements

### Validated

- ✓ Color-coded input interface for marking letter feedback (green/yellow/gray) — v1.0
- ✓ Word filtering that eliminates words violating known constraints — v1.0
- ✓ Smart word ranking combining letter frequency and strategic information gain — v1.0
- ✓ Clean, intuitive UX that makes entering guesses effortless — v1.0
- ✓ Comprehensive 5-letter word list suitable for Wordle (2,399 words) — v1.0
- ✓ Authentic Wordle dark theme with animations — v1.0
- ✓ Invalid word feedback with shake animation — v1.0
- ✓ Real-time filtering on every keystroke — v1.0
- ✓ PWA support with service worker for offline use — v1.1
- ✓ Hard mode filtering for valid hard-mode guesses only — v1.1
- ✓ Session statistics with persistence (games, wins, streaks, distribution) — v1.1
- ✓ Historical Wordle puzzles with practice mode (1,671 puzzles) — v1.1
- ✓ Keyboard hint display with color-coded letter states — v1.1
- ✓ Click-to-insert suggestions for faster word entry — v1.1
- ✓ Light/dark mode toggle with system preference detection — v1.1
- ✓ Full game mode with auto-revealing colors and flip animations — v1.1
- ✓ Header navigation bar with icon buttons — v1.2
- ✓ Clickable on-screen keyboard for mobile users — v1.2
- ✓ Consolidated settings modal (theme, hints, hard mode, NYT mode) — v1.2
- ✓ JSON-based word data with freshness tracking — v1.2
- ✓ NYT mode toggle for daily puzzle vs open mode — v1.2
- ✓ Open Mode with random word selection and unlimited replays — v1.2
- ✓ Variable word lengths (4-10 letters) in Open Mode — v1.2
- ✓ Progressive hints system with 6 sequential hints per word — v1.2
- ✓ Portuguese language support with 157k+ words — v1.2
- ✓ Accented character keyboard input (long-press on mobile) — v1.2
- ✓ Language selector in settings (English/Portuguese) — v1.2
- ✓ Production deployment on custom domain (wordle.brdk.cc) — v1.3
- ✓ Automatic CI/CD via Vercel GitHub integration — v1.3
- ✓ PWA stable identity across domain changes — v1.3

### Active

(None — v1.3 Deployment shipped)

### Out of Scope

- Mobile native app — PWA provides app-like experience on mobile
- User accounts — no login, stats stored locally
- Multiplayer — single-player experience only

## Context

Shipped v1.3 with ~4,000 lines TypeScript code plus ~164k lines word list data.
Tech stack: Vite, TypeScript, vanilla DOM (no framework), vite-plugin-pwa.
Deployed at https://wordle.brdk.cc via Vercel with automatic CI/CD from GitHub.
App is a full-featured multilingual Wordle with three modes: NYT daily, Practice (1,671 historical puzzles), and Open Mode (random words, 4-10 letters).
Supports English and Portuguese languages with accented character input.
Installable as PWA on mobile and desktop.

## Constraints

- **None specified** — free to use best-fit technologies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla TypeScript (no React/Vue) | App complexity doesn't warrant a framework | ✓ Good - kept bundle small, code simple |
| Word list as const array (~50KB) | Acceptable file size, no fetch needed | ✓ Good - instant load, no async issues |
| Immutable constraint updates | Clear state management | ✓ Good - easy to reason about |
| Auto-mode ranking (>500 uses frequency) | Performance optimization | ✓ Good - responsive even with full list |
| Event delegation for click handling | Single listener more efficient | ✓ Good - cleaner code, better performance |
| Real-time filtering on keystroke | Better UX than submit-based | ✓ Good - feels responsive and modern |
| Wordle's exact color palette | Authentic look and feel | ✓ Good - familiar to users |
| Embed historical Wordle answers | Avoid CORS issues with NYT/WordleHints APIs | ✓ Good - reliable, no network dependency |
| CSS custom properties for theming | Runtime theme switching without reload | ✓ Good - smooth transitions |
| Two-pass color algorithm | Match Wordle's exact behavior for duplicates | ✓ Good - accurate game logic |
| Display-only keyboard (not clickable) | Avoid scope creep, show hints only | ⚠️ Revised in v1.2 - made clickable for mobile |
| Stats persist across sessions | Reset Game doesn't clear cumulative stats | ✓ Good - meaningful long-term tracking |
| Header at top with icon navigation | Consistent with app conventions | ✓ Good - familiar UX pattern |
| Settings modal consolidation | Single place for all preferences | ✓ Good - cleaner header, discoverable settings |
| JSON word data format | Independent updates without code changes | ✓ Good - flexible data management |
| Open Mode with variable lengths | Extend gameplay beyond 5-letter words | ✓ Good - replayability and variety |
| Progressive hints (6 per word) | Help stuck players without giving answer | ✓ Good - balanced assistance |
| Portuguese word lists from IME-USP | CC BY license, comprehensive dictionary | ✓ Good - 157k+ quality words |
| Accent popup above key | Avoid finger occlusion on mobile | ✓ Good - better touch UX |
| Language setting disabled in NYT mode | NYT puzzles are English only | ✓ Good - prevents confusion |
| Cloudflare DNS only mode for Vercel | SSL compatibility with Vercel certs | ✓ Good - Full (strict) SSL works |
| PWA id field for domain migration | Stable app identity across domain changes | ✓ Good - smooth migration from gh-pages |
| Vercel over GitHub Pages | Faster builds, automatic HTTPS, better DX | ✓ Good - simpler deployment process |

---
*Last updated: 2026-01-21 after v1.3 milestone*
