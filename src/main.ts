import './style.css';
import { WORD_LIST } from './data/words';
import { GuessGrid } from './ui/GuessGrid';
import { Suggestions } from './ui/Suggestions';
import { rankWords } from './logic/ranking';

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

// Display initial suggestions (full word list ranked)
const initialRankedWords = rankWords(WORD_LIST, WORD_LIST);
suggestions.update(initialRankedWords, WORD_LIST.length);

// Set up submit callback (will be wired to constraint logic in Plan 02)
guessGrid.onSubmit((row) => {
  console.log(`Row ${row} submitted with word: ${guessGrid.getCurrentWord()}`);
  // In Plan 02 Task 2, this will trigger:
  // 1. Get feedback from colors
  // 2. Update constraints
  // 3. Filter word list
  // 4. Display suggestions
});
