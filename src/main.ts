import './style.css';
import type { Constraints } from './types';
import { WORD_LIST } from './data/words';
import { GuessGrid } from './ui/GuessGrid';
import { Suggestions } from './ui/Suggestions';
import { rankWords } from './logic/ranking';
import { createEmptyConstraints, addGuessToConstraints } from './logic/constraints';
import { filterWords } from './logic/filter';

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
      ${createGuessGrid()}
      <div class="suggestions-area">
        <!-- Placeholder for Plan 02: suggestions display -->
      </div>
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
let currentConstraints: Constraints = createEmptyConstraints();
let filteredWords: string[] = WORD_LIST;

// Display initial suggestions (full word list ranked)
const initialRankedWords = rankWords(WORD_LIST, WORD_LIST);
suggestions.update(initialRankedWords, WORD_LIST.length);

// Set up submit callback - process guess and update suggestions
guessGrid.onSubmit((row) => {
  // Get feedback from current row colors
  const feedback = guessGrid.getGuessFeedback(row);
  if (!feedback) return;

  // Update constraints based on feedback
  currentConstraints = addGuessToConstraints(currentConstraints, feedback);

  // Filter word list with new constraints
  filteredWords = filterWords(WORD_LIST, currentConstraints);

  // Rank the filtered words
  const rankedWords = rankWords(filteredWords, filteredWords);

  // Update suggestions display
  suggestions.update(rankedWords, filteredWords.length);

  // Advance to next row
  guessGrid.advanceToNextRow();
});
