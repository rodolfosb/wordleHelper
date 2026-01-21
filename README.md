# Wordle Helper

A full-featured multilingual Wordle game with intelligent word suggestions. Play NYT daily puzzles, practice with 1,671 historical puzzles, or enjoy Open Mode with random words in variable lengths (4-10 letters).

**Live Demo:** https://wordle.brdk.cc

## Features

- **NYT Daily Mode** - Play the official NYT Wordle puzzle with the same word as the live game
- **Practice Mode** - Replay 1,671 historical puzzles from the NYT archive
- **Open Mode** - Random word selection with variable word lengths (4-10 letters) for unlimited play
- **Smart Suggestions** - Intelligent word ranking combining letter frequency and strategic information gain
- **Hard Mode** - Filter suggestions to only show valid hard-mode guesses
- **Progressive Hints** - 6 sequential hints per word to help when stuck
- **Multilingual** - English and Portuguese language support with accented character input
- **Statistics** - Track games played, wins, streaks, and guess distribution
- **Themes** - Light and dark mode with system preference detection
- **Offline Support** - Installable as a PWA, works without internet

## Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe vanilla DOM (no framework)
- **vite-plugin-pwa** - Service worker and PWA manifest generation

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create production build
npm run build

# Preview production build
npm run preview
```

## Deployment

Auto-deploys to Vercel on push to `main` branch.

## PWA Installation

The app can be installed as a Progressive Web App:

**Mobile (iOS/Android):**
1. Visit https://wordle.brdk.cc in your browser
2. Tap the share button
3. Select "Add to Home Screen"

**Desktop (Chrome/Edge):**
1. Visit https://wordle.brdk.cc
2. Click the install icon in the address bar (or menu > "Install Wordle Helper")
