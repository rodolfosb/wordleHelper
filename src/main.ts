import './style.css';
import type { Constraints, SessionStats } from './types';
import { WORD_LIST } from './data/words';
import { GuessGrid } from './ui/GuessGrid';
import { Suggestions } from './ui/Suggestions';
import { StatsModal } from './ui/StatsModal';
import { rankWords } from './logic/ranking';
import { createEmptyConstraints, addGuessToConstraints } from './logic/constraints';
import { filterWords, filterByPrefix, isValidWord } from './logic/filter';
import { loadStats, saveStats, recordGame } from './logic/stats';

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
      <button class="stats-btn" aria-label="View statistics" title="Statistics">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
          <path d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
        </svg>
      </button>
    </header>
    <main class="app-main">
      <div class="controls">
        <button class="reset-game-btn">Reset Game</button>
      </div>
      ${createGuessGrid()}
      <div class="game-message"></div>
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
let gameEnded: boolean = false;
let currentStats: SessionStats = loadStats();

// Initialize StatsModal
const appContainer = document.querySelector<HTMLElement>('.app-container')!;
const statsModal = new StatsModal(appContainer);

// Get game message element reference
const gameMessageElement = document.querySelector<HTMLElement>('.game-message')!;

// Helper function to show game messages
function showGameMessage(message: string, type: 'error' | 'success' | 'info' | ''): void {
  gameMessageElement.textContent = message;
  gameMessageElement.className = 'game-message';
  if (type) {
    gameMessageElement.classList.add(`message-${type}`);
  }
}

// Helper function to clear game message
function clearGameMessage(): void {
  gameMessageElement.textContent = '';
  gameMessageElement.className = 'game-message';
}

// Helper function to check if row is all green (win condition)
function isRowAllGreen(row: number): boolean {
  const feedback = guessGrid.getGuessFeedback(row);
  if (!feedback) return false;
  return feedback.every((f) => f.status === 'green');
}

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
  // Clear temporary messages when user types
  if (!gameEnded) {
    clearGameMessage();
  }
  updateSuggestions();
});

// Set up submit callback - validate word before advancing
guessGrid.onSubmit((row: number) => {
  // Don't allow submission if game has ended
  if (gameEnded) return;

  const word = guessGrid.getCurrentWord();

  // Check if word is valid
  if (!isValidWord(word)) {
    // Shake row and show message for invalid word, don't advance
    guessGrid.shakeRow(row);
    showGameMessage('Invalid word', 'error');
    return;
  }

  // Clear any error message
  clearGameMessage();

  // Check for win condition (all green)
  if (isRowAllGreen(row)) {
    gameEnded = true;
    guessGrid.lockInput();
    showGameMessage('Congratulations! You found the word!', 'success');
    // Record win stats (row + 1 = number of guesses)
    currentStats = recordGame(currentStats, true, row + 1);
    saveStats(currentStats);
    return;
  }

  // Check if this was the last row (game over without win)
  if (row === 5) {
    gameEnded = true;
    guessGrid.lockInput();
    showGameMessage('Game over! No more guesses remaining.', 'info');
    // Record loss stats
    currentStats = recordGame(currentStats, false, 6);
    saveStats(currentStats);
    return;
  }

  // Advance to next row when Enter is pressed on a valid complete row
  guessGrid.advanceToNextRow();
});

// Reset game function
function resetGame(): void {
  // Reset app state
  filteredWords = WORD_LIST;
  gameEnded = false;

  // Clear any game messages
  clearGameMessage();

  // Reset GuessGrid (clear all cells, colors, return to row 0)
  guessGrid.reset();

  // Reset suggestions to show full word list ranked
  const rankedWords = rankWords(WORD_LIST, WORD_LIST);
  suggestions.update(rankedWords, WORD_LIST.length);
}

// Set up Reset Game button
const resetGameBtn = document.querySelector<HTMLButtonElement>('.reset-game-btn')!;
resetGameBtn.addEventListener('click', resetGame);

// Auto-recover focus after clicking anywhere on the page (UAT-007)
document.addEventListener('click', (e) => {
  // Don't auto-focus if clicking on stats button or modal
  const target = e.target as HTMLElement;
  if (target.closest('.stats-btn') || target.closest('.stats-modal-overlay')) {
    return;
  }
  // Small delay to allow any other click handlers to process first
  requestAnimationFrame(() => {
    guessGrid.focusGrid();
  });
});

// Set up Stats button click handler
const statsBtn = document.querySelector<HTMLButtonElement>('.stats-btn')!;
statsBtn.addEventListener('click', () => {
  statsModal.render(currentStats);
  statsModal.show();
});
