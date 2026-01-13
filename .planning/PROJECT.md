# Wordle Helper

## What This Is

A web application that helps users solve the daily Wordle puzzle by suggesting words based on their guesses and the color-coded feedback from the game. Users input their guesses and mark each letter as green (correct position), yellow (wrong position), or gray (not in word), and the app suggests the best words to try next.

## Core Value

Accurately filter and intelligently rank word suggestions so users can solve Wordle puzzles faster and more reliably.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Color-coded input interface for marking letter feedback (green/yellow/gray)
- [ ] Word filtering that eliminates words violating known constraints
- [ ] Smart word ranking combining letter frequency and strategic information gain
- [ ] Clean, intuitive UX that makes entering guesses effortless
- [ ] Comprehensive 5-letter word list suitable for Wordle

### Out of Scope

- Mobile app — web only for v1, responsive design is sufficient
- Account/history — no user login, saved games, or progress tracking

## Context

- Target audience is public users playing the NYT Wordle game
- Success is measured by the app helping solve actual puzzles
- Wordle uses 5-letter words with 6 guess attempts
- The official Wordle game has a curated word list (solutions vs. valid guesses)

## Constraints

- **None specified** — free to use best-fit technologies

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Color-coded visual input | Matches mental model of Wordle feedback | — Pending |
| Combined ranking approach | Balances simplicity (frequency) with sophistication (information theory) | — Pending |

---
*Last updated: 2026-01-13 after initialization*
