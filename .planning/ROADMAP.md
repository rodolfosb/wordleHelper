# Roadmap: Wordle Helper

## Overview

Build a web application that helps users solve Wordle puzzles by suggesting optimal words based on their guesses and color-coded feedback. Starting with a solid foundation and word list, we'll implement constraint-based filtering, intelligent ranking algorithms, and a clean input interface that mirrors Wordle's visual feedback system.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Project setup, word list, and core data structures ✓
- [x] **Phase 2: Core Logic** - Word filtering engine with constraint handling
- [x] **Phase 3: Ranking System** - Letter frequency and information gain scoring ✓
- [x] **Phase 4: User Interface** - Color-coded input and suggestions display ✓
- [x] **Phase 5: Polish** - UX refinement, edge cases, and final testing ✓

## Phase Details

### Phase 1: Foundation
**Goal**: Establish project structure, configure tooling, and create a comprehensive 5-letter word list with supporting data structures
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard web project setup)
**Plans**: TBD

Plans:
- [x] 01-01: Project scaffolding and word list integration ✓

### Phase 2: Core Logic
**Goal**: Implement the constraint engine that filters words based on green/yellow/gray feedback
**Depends on**: Phase 1
**Research**: Unlikely (algorithmic filtering with no external dependencies)
**Plans**: TBD

Plans:
- [x] 02-01: Constraint modeling and word filtering

### Phase 3: Ranking System
**Goal**: Score and rank remaining words by letter frequency and strategic value for information gain
**Depends on**: Phase 2
**Research**: Likely (information theory approach for optimal guessing)
**Research topics**: Entropy-based word selection, information gain algorithms for word games, letter frequency analysis
**Plans**: TBD

Plans:
- [x] 03-01: Letter frequency scoring ✓
- [x] 03-02: Information gain ranking ✓

### Phase 4: User Interface
**Goal**: Build the color-coded input interface and word suggestions display
**Depends on**: Phase 3
**Research**: Unlikely (standard web UI patterns, no external APIs)
**Plans**: TBD

Plans:
- [x] 04-01: Input interface for guess entry and color marking ✓
- [x] 04-02: Suggestions display and interaction ✓

### Phase 5: Polish
**Goal**: Refine UX, handle edge cases, optimize performance, and ensure reliable puzzle-solving
**Depends on**: Phase 4
**Research**: Unlikely (internal refinement work)
**Plans**: TBD

Plans:
- [x] 05-01: Dark theme, animations, and invalid word feedback ✓

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/1 | Complete | 2026-01-13 |
| 2. Core Logic | 1/1 | Complete | 2026-01-13 |
| 3. Ranking System | 2/2 | Complete | 2026-01-13 |
| 4. User Interface | 2/2 | Complete | 2026-01-13 |
| 5. Polish | 1/1 | Complete | 2026-01-13 |
