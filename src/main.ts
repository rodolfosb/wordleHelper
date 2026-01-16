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
import { calculateLetterStatuses } from './logic/gameLogic';
import { getTodaysPuzzle } from './data/history';

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
      <div class="header-left"></div>
      <div class="header-center">
        <h1>Wordle</h1>
        <div class="header-subtitle"></div>
      </div>
      <div class="header-right">
        <button class="help-btn" aria-label="How to play" title="How to play">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
          </svg>
        </button>
        <button class="stats-btn" aria-label="View statistics" title="Statistics">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
          </svg>
        </button>
        <button class="practice-btn" aria-label="Practice with past puzzles" title="Practice">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
        </button>
        <button class="settings-btn" aria-label="Settings" title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.31,0.06-0.63,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
        </button>
        <button class="language-btn" aria-label="Language" title="Language">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
          </svg>
        </button>
        <button class="theme-btn" aria-label="Toggle theme" title="Toggle theme">
          <svg class="theme-icon-sun" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
          </svg>
          <svg class="theme-icon-moon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
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

// Game mode is always enabled - app functions as a playable Wordle game
const gameMode: boolean = true;

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

// Get subtitle element reference
const headerSubtitle = document.querySelector<HTMLElement>('.header-subtitle')!;

// Helper function to update the subtitle with puzzle info
function updateSubtitle(puzzle: HistoricalPuzzle, isFallback: boolean): void {
  if (isFallback) {
    // Data doesn't extend to today - show that this is the latest available
    headerSubtitle.textContent = `Wordle #${puzzle.game} (${puzzle.date})`;
  } else {
    headerSubtitle.textContent = `Wordle #${puzzle.game} - ${puzzle.date}`;
  }
}

// Initialize game with today's puzzle
function initializeGame(): void {
  const result = getTodaysPuzzle();
  if (result) {
    currentPuzzle = result.puzzle;
    guessGrid.setGameMode(true);
    // Update subtitle to show puzzle info
    updateSubtitle(currentPuzzle, result.isFallback);
  } else {
    // No puzzle data available at all
    console.warn('No puzzle data available');
    headerSubtitle.textContent = 'No puzzle data available';
  }
}

// Initialize game on app start
initializeGame();

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
    showGameMessage('Not in word list', 'error');
    return;
  }

  // Clear any error message
  clearGameMessage();

  // In game mode, calculate and set colors automatically
  if (gameMode && currentPuzzle) {
    const colors = calculateLetterStatuses(word, currentPuzzle.answer);
    guessGrid.setRowColors(row, colors);

    // Wait for flip animation to complete before checking win/loss
    // Animation takes 500ms per cell + 400ms stagger = ~900ms total
    setTimeout(() => {
      // Update keyboard with feedback from this row
      const feedback = guessGrid.getGuessFeedback(row);
      if (feedback) {
        keyboard.updateFromFeedback(feedback);
      }

      // Update suggestions based on revealed feedback
      updateSuggestions();

      // Check for win condition (all green)
      const isWin = colors.every((c) => c === 'green');
      if (isWin) {
        gameEnded = true;
        guessGrid.lockInput();

        if (practiceMode) {
          // In practice mode, show the answer
          showGameMessage(`Correct! The answer was: ${currentPuzzle!.answer.toUpperCase()}`, 'success');
          // Do NOT update stats for practice games
        } else {
          showGameMessage('Congratulations! You solved it!', 'success');
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

        if (practiceMode) {
          // In practice mode, show the answer
          showGameMessage(`Game over! The answer was: ${currentPuzzle!.answer.toUpperCase()}`, 'info');
          // Do NOT update stats for practice games
        } else {
          showGameMessage(`Game over! The answer was: ${currentPuzzle!.answer.toUpperCase()}`, 'info');
          // Record loss stats
          currentStats = recordGame(currentStats, false, 6);
          saveStats(currentStats);
        }
        return;
      }

      // Advance to next row after animation completes
      guessGrid.advanceToNextRow();
    }, 600); // Wait for animation to complete (5 cells * 100ms stagger + some buffer)
  } else {
    // Fallback for when no puzzle is loaded (shouldn't happen normally)
    const feedback = guessGrid.getGuessFeedback(row);
    if (feedback) {
      keyboard.updateFromFeedback(feedback);
    }

    if (isRowAllGreen(row)) {
      gameEnded = true;
      guessGrid.lockInput();
      showGameMessage('Congratulations! You found the word!', 'success');
      return;
    }

    if (row === 5) {
      gameEnded = true;
      guessGrid.lockInput();
      showGameMessage('Game over! No more guesses remaining.', 'info');
      return;
    }

    guessGrid.advanceToNextRow();
  }
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

  // Reload today's puzzle for fresh game (if not in practice mode)
  if (!practiceMode) {
    initializeGame();
  }

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
    target.closest('.theme-btn') ||
    target.closest('.help-btn') ||
    target.closest('.settings-btn') ||
    target.closest('.language-btn')
  ) {
    return;
  }

  // Don't steal focus from date inputs - their native calendar picker
  // renders outside the DOM and clicks on it shouldn't trigger focus grab
  const activeElement = document.activeElement;
  if (activeElement && activeElement.getAttribute('type') === 'date') {
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

// Helper to check if a date string is today
function isToday(dateStr: string): boolean {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  return dateStr === todayStr;
}

// Practice mode functions
function startPracticeMode(puzzle: HistoricalPuzzle): void {
  // Check if this is today's puzzle
  const isTodaysPuzzle = isToday(puzzle.date);

  // Set practice mode state - only true if it's a past puzzle
  practiceMode = !isTodaysPuzzle;
  currentPuzzle = puzzle;

  // Reset game state
  filteredWords = WORD_LIST;
  gameEnded = false;
  clearGameMessage();
  guessGrid.reset();
  keyboard.reset();

  // Enable game mode for auto-color reveal
  guessGrid.setGameMode(true);

  // Reset suggestions to show full word list ranked
  const rankedWords = rankWords(WORD_LIST, WORD_LIST);
  suggestions.update(rankedWords, WORD_LIST.length);

  // Update the subtitle with puzzle info
  updateSubtitle(puzzle, false);

  // Only show practice indicator if it's a past puzzle (not today)
  if (practiceMode) {
    practiceIndicatorText.textContent = `Practice: Wordle #${puzzle.game} (${puzzle.date})`;
    practiceIndicator.classList.remove('hidden');
  } else {
    // It's today's puzzle - hide practice indicator
    practiceIndicator.classList.add('hidden');
  }

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
