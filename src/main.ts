import './style.css';
import type { Constraints } from './types';
import { WORD_LIST } from './data/words';
import { GuessGrid } from './ui/GuessGrid';
import { Suggestions } from './ui/Suggestions';
import { rankWords } from './logic/ranking';
import { createEmptyConstraints, addGuessToConstraints } from './logic/constraints';
import { filterWords, filterByPrefix } from './logic/filter';

// Create guess grid HTML structure
function createGuessGrid(): string {
  let gridHtml = '<div class="guess-grid">';
  for (let row = 0; row < 6; row++) {
    gridHtml += `<div class="guess-row" data-row="${row}">`;
    for (let col = 0; col < 5; col++) {
      gridHtml += `<div class="guess-cell" data-row="${row}" data-col="${col}"></div>`;
    }
    gridHtml += '</div>';
  }
  gridHtml += '</div>';
  return gridHtml;
}

// Render the app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app-container">
    <header class="app-header">
      <h1>Wordle Helper</h1>
    </header>
    <main class="app-main">
      <div class="controls">
        <button class="new-game-btn">New Game</button>
      </div>
      ${createGuessGrid()}
      <div class="suggestions-area"></div>
    </main>
  </div>
`;

// Initialize GuessGrid
const gridElement = document.querySelector<HTMLElement>('.guess-grid')!;
const guessGrid = new GuessGrid(gridElement);

// Initialize Suggestions panel
const suggestionsArea = document.querySelector<HTMLElement>('.suggestions-area')!;
const suggestions = new Suggestions(suggestionsArea);

// App state
let filteredWords: string[] = WORD_LIST;

// Display initial suggestions (full word list ranked)
const initialRankedWords = rankWords(WORD_LIST, WORD_LIST);
suggestions.update(initialRankedWords, WORD_LIST.length);

// Helper function to update suggestions based on all complete rows
function updateSuggestions(): void {
  const allFeedback = guessGrid.getAllFeedback();

  // Rebuild constraints from all complete rows
  let constraints: Constraints = createEmptyConstraints();
  for (const feedback of allFeedback) {
    constraints = addGuessToConstraints(constraints, feedback);
  }

  // Filter word list with new constraints
  filteredWords = filterWords(WORD_LIST, constraints);

  // Apply prefix filter for partial words in current row (UAT-006)
  const partialWord = guessGrid.getCurrentPartialWord();
  if (partialWord.length > 0) {
    filteredWords = filterByPrefix(filteredWords, partialWord);
  }

  // Rank the filtered words
  const rankedWords = rankWords(filteredWords, filteredWords);

  // Update suggestions display
  suggestions.update(rankedWords, filteredWords.length);
}

// Set up onChange callback - real-time filtering as user types/clicks
guessGrid.onChange(() => {
  updateSuggestions();
});

// Set up submit callback - just advance to next row (filtering happens via onChange)
guessGrid.onSubmit(() => {
  // Advance to next row when Enter is pressed on a complete row
  guessGrid.advanceToNextRow();
});

// Reset game function
function resetGame(): void {
  // Reset app state
  filteredWords = WORD_LIST;

  // Reset GuessGrid (clear all cells, colors, return to row 0)
  guessGrid.reset();

  // Reset suggestions to show full word list ranked
  const rankedWords = rankWords(WORD_LIST, WORD_LIST);
  suggestions.update(rankedWords, WORD_LIST.length);
}

// Set up New Game button
const newGameBtn = document.querySelector<HTMLButtonElement>('.new-game-btn')!;
newGameBtn.addEventListener('click', resetGame);

// Auto-recover focus after clicking anywhere on the page (UAT-007)
document.addEventListener('click', () => {
  // Small delay to allow any other click handlers to process first
  requestAnimationFrame(() => {
    guessGrid.focusGrid();
  });
});
