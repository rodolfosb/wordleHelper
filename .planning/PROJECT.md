# Wordle Helper

## What This Is

A fully playable web-based Wordle game with intelligent word suggestions. Play daily puzzles or practice with 1,671 historical puzzles from June 2021. The app auto-reveals letter colors using Wordle's exact algorithm, tracks session statistics, and works offline as an installable PWA.

## Core Value

A complete Wordle experience that works anywhere—play daily puzzles, practice past games, track your stats, and get intelligent word suggestions when stuck.

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

### Active

(None — v1.1 Features complete)

### Out of Scope

- Mobile native app — PWA provides app-like experience on mobile
- User accounts — no login, stats stored locally
- Multiplayer — single-player experience only

## Context

Shipped v1.1 with ~18,800 lines TypeScript/HTML/CSS.
Tech stack: Vite, TypeScript, vanilla DOM (no framework), vite-plugin-pwa.
App is now a playable Wordle game, not just a helper tool.
1,671 historical puzzles embedded for comprehensive practice mode.
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
| Display-only keyboard (not clickable) | Avoid scope creep, show hints only | ✓ Good - focused feature |
| Stats persist across sessions | Reset Game doesn't clear cumulative stats | ✓ Good - meaningful long-term tracking |

---
*Last updated: 2026-01-16 after v1.1 milestone*
