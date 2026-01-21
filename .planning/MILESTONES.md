# Project Milestones: Wordle Helper

## v1.4 Bug Fixes (Shipped: 2026-01-21)

**Delivered:** Fixed gameplay bugs including hard mode validation enforcement, submitted row locking, and timezone-related puzzle date sync issue.

**Phases completed:** 24-25 (5 plans total)

**Key accomplishments:**

- Hard mode guess validation enforced with error messages on submission
- Submitted row locking prevents editing rows with revealed colors
- Fixed hard mode first guess validation (correctly allows any valid word)
- Fixed backspace state corruption at col 0 on locked rows
- Fixed timezone sync issue using local date formatting instead of UTC
- Updated embedded puzzle data through 2026-01-21

**Stats:**

- 4 source files modified (constraints.ts, main.ts, GuessGrid.ts, history.ts)
- ~100 lines of TypeScript added
- 2 phases, 5 plans
- Same day completion (2026-01-21)

**Git range:** `93fc17c` → `2d2e985`

**What's next:** Project feature-complete and bug-free. Future enhancements could include additional languages, achievements, or social features.

---

## v1.3 Deployment (Shipped: 2026-01-21)

**Delivered:** Production deployment on Vercel with custom domain wordle.brdk.cc, automatic CI/CD, and comprehensive project documentation.

**Phases completed:** 19-23 (3 plans total)

**Key accomplishments:**

- Deployed to Vercel with automatic GitHub CI/CD integration
- Configured custom subdomain wordle.brdk.cc with Cloudflare DNS
- Fixed base path for root deployment (removed /wordleHelper/ prefix)
- Added PWA id field for stable app identity across domain changes
- Removed gh-pages dependency (Vercel handles all deployment)
- Created comprehensive README.md documentation

**Stats:**

- 19 files modified
- ~4,000 lines of TypeScript code
- 5 phases, 3 plans
- 2 days from v1.2 to ship (2026-01-19 → 2026-01-21)

**Git range:** `e1f38ea` → `8d231b0`

**What's next:** Project deployed to production. Future enhancements could include additional languages, achievements, or social features.

---

## v1.2 Complete Experience (Shipped: 2026-01-19)

**Delivered:** Full-featured multilingual Wordle with header navigation, settings modal, Open Mode with variable word lengths, progressive hints, and Portuguese language support.

**Phases completed:** 12-18 (10 plans total)

**Key accomplishments:**

- Header navigation bar with clickable on-screen keyboard for mobile users
- Consolidated settings modal with theme, hints, hard mode, and NYT mode toggles
- Open Mode with random word selection and variable word lengths (4-10 letters)
- JSON-based word data with freshness tracking for independent updates
- Progressive hints system with 6 sequential hints per word (first letter, last letter, vowel count, positions, full reveal)
- Full Portuguese language support with 157k+ words and accented character keyboard input

**Stats:**

- 60 files modified
- ~3,800 lines of TypeScript code (plus ~164k lines of Portuguese word data)
- 7 phases, 10 plans
- 3 days from v1.1 to ship (2026-01-16 → 2026-01-19)

**Git range:** `2689545` → `cbe68f3`

**What's next:** Project feature-complete. Future enhancements could include additional languages, achievements, or social features.

---

## v1.1 Features (Shipped: 2026-01-16)

**Delivered:** A playable Wordle game with PWA support, hard mode, session statistics, historical puzzle practice, keyboard hints, light/dark mode, and auto-revealing letter colors.

**Phases completed:** 6-11 (8 plans total)

**Key accomplishments:**

- PWA support with vite-plugin-pwa, service worker, and installable web manifest for offline use
- Hard mode filtering that shows only valid hard-mode guesses
- Session statistics with LocalStorage persistence, modal UI, win streaks, and guess distribution histogram
- Historical Wordle puzzles with practice mode (1,671 puzzles from June 2021 - January 2026)
- UI enhancements: QWERTY keyboard with color-coded letter status hints, click-to-insert suggestions
- Light/dark mode toggle with system preference detection and localStorage persistence
- Full game mode transforming app from helper tool to playable Wordle with auto-revealing colors and flip animations

**Stats:**

- 51 files modified
- ~14,800 lines added
- 6 phases, 8 plans
- 3 days from v1.0 to ship (2026-01-13 → 2026-01-16)

**Git range:** `47f4433` → `2689545`

**What's next:** Project feature-complete for v1.1. Future milestones could add multiplayer, achievements, or mobile app.

---

## v1.0 MVP (Shipped: 2026-01-13)

**Delivered:** A complete Wordle puzzle-solving assistant with color-coded input, constraint-based filtering, and intelligent word ranking using information theory.

**Phases completed:** 1-5 (9 plans total)

**Key accomplishments:**

- Vite + TypeScript project with 2,399-word comprehensive Wordle list
- Constraint engine processing green/yellow/gray feedback with duplicate letter handling
- Information gain ranking with entropy-based word selection
- Color-coded 6x5 input grid with real-time filtering on every keystroke
- Authentic Wordle dark theme with pop and shake animations

**Stats:**

- 13 source files created
- 3,990 lines of TypeScript/HTML/CSS
- 5 phases, 9 plans
- 1 day from start to ship (2026-01-13)

**Git range:** `dd1ca7f` → `13daef0`

**What's next:** Project complete - MVP fully functional

---
