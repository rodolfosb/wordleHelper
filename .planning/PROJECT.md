# Wordle Helper

## What This Is

A web application that helps users solve the daily Wordle puzzle by suggesting words based on their guesses and the color-coded feedback from the game. Users input their guesses and mark each letter as green (correct position), yellow (wrong position), or gray (not in word), and the app suggests the best words to try next using information theory and letter frequency analysis.

## Core Value

Accurately filter and intelligently rank word suggestions so users can solve Wordle puzzles faster and more reliably.

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

### Active

(None — v1.0 MVP complete)

### Out of Scope

- Mobile app — web only for v1, responsive design is sufficient
- Account/history — no user login, saved games, or progress tracking
- Offline mode — requires word list embedded (already done, could add PWA later)

## Context

Shipped v1.0 with 3,990 lines TypeScript/HTML/CSS.
Tech stack: Vite, TypeScript, vanilla DOM (no framework).
Initial testing confirms app helps solve actual Wordle puzzles effectively.
2,399 word list exceeds official 2,309 Wordle solutions.

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

---
*Last updated: 2026-01-13 after v1.0 milestone*
