import './style.css';
import type { Constraints, SessionStats, HistoricalPuzzle } from './types';
import { WORD_LIST } from './data/words';
import { GuessGrid } from './ui/GuessGrid';
import { Suggestions } from './ui/Suggestions';
import { Keyboard } from './ui/Keyboard';
import { StatsModal } from './ui/StatsModal';
import { HistoryPicker } from './ui/HistoryPicker';
import { rankWords } from './logic/ranking';
import { createEmptyConstraints, addGuessToConstraints } from './logic/constraints';
import { filterWords, filterByPrefix, isValidWord } from './logic/filter';
import { loadStats, saveStats, recordGame } from './logic/stats';
import { getInitialTheme, setTheme, toggleTheme } from './utils/theme';

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
  <div class="app-container" id="app-container">
    <header class="app-header">
      <h1>Wordle Helper</h1>
      <div class="header-buttons">
        <button class="theme-btn" aria-label="Toggle theme" title="Toggle theme">
          <svg class="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
          </svg>
          <svg class="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
        </button>
        <button class="practice-btn" aria-label="Practice with past puzzles" title="Practice">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
        </button>
        <button class="stats-btn" aria-label="View statistics" title="Statistics">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
          </svg>
        </button>
      </div>
    </header>
    <div class="practice-indicator hidden">
      <span class="practice-indicator-text"></span>
      <button class="exit-practice-btn">Exit Practice</button>
    </div>
    <main class="app-main">
      <div class="controls">
        <button class="reset-game-btn">Reset Game</button>
      </div>
      ${createGuessGrid()}
      <div class="game-message"></div>
      <div class="suggestions-area"></div>
      <div class="keyboard-area"></div>
    </main>
  </div>
`;

// Initialize GuessGrid
const gridElement = document.querySelector<HTMLElement>('.guess-grid')!;
const guessGrid = new GuessGrid(gridElement);

// Initialize Suggestions panel
const suggestionsArea = document.querySelector<HTMLElement>('.suggestions-area')!;
const suggestions = new Suggestions(suggestionsArea);

// Initialize Keyboard display
const keyboardArea = document.querySelector<HTMLElement>('.keyboard-area')!;
const keyboard = new Keyboard(keyboardArea);

// App state
let filteredWords: string[] = WORD_LIST;
let gameEnded: boolean = false;
let currentStats: SessionStats = loadStats();

// Practice mode state
let practiceMode: boolean = false;
let currentPuzzle: HistoricalPuzzle | null = null;

// Initialize StatsModal
const appContainer = document.querySelector<HTMLElement>('.app-container')!;
const statsModal = new StatsModal(appContainer);

// Initialize HistoryPicker
const historyPicker = new HistoryPicker('app-container', startPracticeMode);

// Practice mode indicator elements
const practiceIndicator = document.querySelector<HTMLElement>('.practice-indicator')!;
const practiceIndicatorText = document.querySelector<HTMLElement>('.practice-indicator-text')!;
const exitPracticeBtn = document.querySelector<HTMLButtonElement>('.exit-practice-btn')!;

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

// Handle click on suggestion word - fill it into current row
function handleSuggestionClick(word: string): void {
  // Don't allow if game has ended
  if (gameEnded) return;

  // Fill the word into the current row
  guessGrid.fillCurrentRow(word);

  // Focus the grid for continued keyboard input
  guessGrid.focusGrid();
}

// Set up suggestion click callback
suggestions.onWordClick(handleSuggestionClick);

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

  // Update keyboard with feedback from this row
  const feedback = guessGrid.getGuessFeedback(row);
  if (feedback) {
    keyboard.updateFromFeedback(feedback);
  }

  // Check for win condition (all green)
  if (isRowAllGreen(row)) {
    gameEnded = true;
    guessGrid.lockInput();

    if (practiceMode && currentPuzzle) {
      // In practice mode, show the answer
      showGameMessage(`Correct! The answer was: ${currentPuzzle.answer.toUpperCase()}`, 'success');
      // Do NOT update stats for practice games
    } else {
      showGameMessage('Congratulations! You found the word!', 'success');
      // Record win stats (row + 1 = number of guesses)
      currentStats = recordGame(currentStats, true, row + 1);
      saveStats(currentStats);
    }
    return;
  }

  // Check if this was the last row (game over without win)
  if (row === 5) {
    gameEnded = true;
    guessGrid.lockInput();

    if (practiceMode && currentPuzzle) {
      // In practice mode, show the answer
      showGameMessage(`Game over! The answer was: ${currentPuzzle.answer.toUpperCase()}`, 'info');
      // Do NOT update stats for practice games
    } else {
      showGameMessage('Game over! No more guesses remaining.', 'info');
      // Record loss stats
      currentStats = recordGame(currentStats, false, 6);
      saveStats(currentStats);
    }
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

  // Reset keyboard to show all letters as unused
  keyboard.reset();

  // Reset suggestions to show full word list ranked
  const rankedWords = rankWords(WORD_LIST, WORD_LIST);
  suggestions.update(rankedWords, WORD_LIST.length);
}

// Set up Reset Game button
const resetGameBtn = document.querySelector<HTMLButtonElement>('.reset-game-btn')!;
resetGameBtn.addEventListener('click', resetGame);

// Auto-recover focus after clicking anywhere on the page (UAT-007)
document.addEventListener('click', (e) => {
  // Don't auto-focus if clicking on buttons or modals
  const target = e.target as HTMLElement;
  if (
    target.closest('.stats-btn') ||
    target.closest('.stats-modal-overlay') ||
    target.closest('.practice-btn') ||
    target.closest('.history-picker-overlay') ||
    target.closest('.theme-btn')
  ) {
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

// Practice mode functions
function startPracticeMode(puzzle: HistoricalPuzzle): void {
  // Set practice mode state
  practiceMode = true;
  currentPuzzle = puzzle;

  // Reset game state
  filteredWords = WORD_LIST;
  gameEnded = false;
  clearGameMessage();
  guessGrid.reset();
  keyboard.reset();

  // Reset suggestions to show full word list ranked
  const rankedWords = rankWords(WORD_LIST, WORD_LIST);
  suggestions.update(rankedWords, WORD_LIST.length);

  // Show practice indicator
  practiceIndicatorText.textContent = `Practice: Wordle #${puzzle.game} (${puzzle.date})`;
  practiceIndicator.classList.remove('hidden');

  // Hide the history picker
  historyPicker.hide();
}

function exitPracticeMode(): void {
  // Clear practice mode state
  practiceMode = false;
  currentPuzzle = null;

  // Hide practice indicator
  practiceIndicator.classList.add('hidden');

  // Reset game for normal play
  resetGame();
}

// Set up Practice button click handler
const practiceBtn = document.querySelector<HTMLButtonElement>('.practice-btn')!;
practiceBtn.addEventListener('click', () => {
  historyPicker.show();
});

// Set up Exit Practice button click handler
exitPracticeBtn.addEventListener('click', exitPracticeMode);

// Initialize theme on app load (respects stored preference or system preference)
setTheme(getInitialTheme());

// Set up Theme toggle button click handler
const themeBtn = document.querySelector<HTMLButtonElement>('.theme-btn')!;
themeBtn.addEventListener('click', () => {
  toggleTheme();
});
