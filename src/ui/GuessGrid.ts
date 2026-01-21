import type { LetterStatus, GuessFeedback, LetterFeedback } from '../types';

/**
 * Portuguese accented characters that are valid in Portuguese words
 */
const PORTUGUESE_ACCENTS = 'áàâãéêíóôõúç';

/**
 * GuessGrid manages the input state and DOM updates for the 6xN guess grid.
 * Handles keyboard input for letters and provides an interface for getting guess feedback.
 * Supports variable word lengths (4-10 letters).
 */
export class GuessGrid {
  private currentRow: number = 0;
  private currentCol: number = 0;
  private gridElement: HTMLElement;
  private cells: HTMLElement[][] = [];
  private letters: string[][] = [];
  private colors: LetterStatus[][] = [];
  private onSubmitCallback?: (row: number) => void;
  private onChangeCallback?: () => void;
  private inputLocked: boolean = false;
  private gameMode: boolean = false;
  private wordLength: number = 5;
  private accentsEnabled: boolean = false;
  private submittedRows: Set<number> = new Set();

  constructor(gridElement: HTMLElement, wordLength: number = 5) {
    this.gridElement = gridElement;
    this.wordLength = wordLength;
    this.initializeGrid();
    this.attachKeyboardListeners();
    this.attachClickListeners();
    this.focusGrid();
  }

  /**
   * Initialize internal state arrays and cache cell elements
   */
  private initializeGrid(): void {
    // Initialize state arrays
    this.letters = [];
    this.colors = [];
    this.cells = [];

    for (let row = 0; row < 6; row++) {
      this.letters[row] = Array(this.wordLength).fill('');
      this.colors[row] = Array(this.wordLength).fill('gray') as LetterStatus[];
      this.cells[row] = [];
    }

    // Cache cell elements
    const rows = this.gridElement.querySelectorAll('.guess-row');
    rows.forEach((rowEl, rowIndex) => {
      const cellElements = rowEl.querySelectorAll('.guess-cell');
      cellElements.forEach((cellEl, colIndex) => {
        this.cells[rowIndex][colIndex] = cellEl as HTMLElement;
      });
    });

    // Make grid focusable
    this.gridElement.setAttribute('tabindex', '0');
  }

  /**
   * Rebuild the grid DOM with the current word length
   */
  private rebuildGrid(): void {
    // Clear existing grid content
    this.gridElement.innerHTML = '';

    // Set CSS custom property for dynamic column count
    this.gridElement.style.setProperty('--word-length', String(this.wordLength));

    // Create new rows and cells
    for (let row = 0; row < 6; row++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'guess-row';
      rowEl.dataset.row = String(row);

      for (let col = 0; col < this.wordLength; col++) {
        const cellEl = document.createElement('div');
        cellEl.className = 'guess-cell';
        cellEl.dataset.row = String(row);
        cellEl.dataset.col = String(col);
        rowEl.appendChild(cellEl);
      }

      this.gridElement.appendChild(rowEl);
    }

    // Reinitialize state arrays and cache cells
    this.initializeGrid();
  }

  /**
   * Set the word length and rebuild the grid
   * @param length - Word length (4-10)
   */
  public setWordLength(length: number): void {
    if (length < 4 || length > 10) return;
    if (length === this.wordLength) return;

    this.wordLength = length;
    this.currentRow = 0;
    this.currentCol = 0;
    this.inputLocked = false;
    this.submittedRows.clear();

    this.rebuildGrid();
    this.focusGrid();
  }

  /**
   * Get the current word length
   */
  public getWordLength(): number {
    return this.wordLength;
  }

  /**
   * Attach keyboard event listeners to the grid
   */
  private attachKeyboardListeners(): void {
    this.gridElement.addEventListener('keydown', (event) => {
      this.handleKeyDown(event as KeyboardEvent);
    });
  }

  /**
   * Attach click event listeners to cells for color cycling
   */
  private attachClickListeners(): void {
    this.gridElement.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('guess-cell')) {
        const row = parseInt(target.dataset.row || '-1', 10);
        const col = parseInt(target.dataset.col || '-1', 10);
        this.handleCellClick(row, col);
      }
    });
  }

  /**
   * Handle cell click for color cycling
   */
  private handleCellClick(row: number, col: number): void {
    if (this.inputLocked) return; // Input is locked
    if (this.gameMode) return; // No manual color cycling in game mode
    if (row < 0 || row >= 6) return;
    if (col < 0 || col >= this.wordLength) return;

    // Only allow color change on cells that have letters
    if (!this.letters[row][col]) return;

    // Cycle through colors: gray -> yellow -> green -> gray
    this.cycleColor(row, col);
    this.updateCell(row, col);

    // Fire onChange callback for real-time filtering
    this.fireOnChange();
  }

  /**
   * Cycle the color of a cell
   */
  private cycleColor(row: number, col: number): void {
    const currentColor = this.colors[row][col];
    const colorOrder: LetterStatus[] = ['gray', 'yellow', 'green'];
    const currentIndex = colorOrder.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colorOrder.length;
    this.colors[row][col] = colorOrder[nextIndex];
  }

  /**
   * Focus the grid element
   */
  public focusGrid(): void {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      this.gridElement.focus();
    });
  }

  /**
   * Check if a character is valid for input
   * Accepts A-Z, and optionally Portuguese accented characters
   */
  private isValidCharacter(char: string): boolean {
    const lowerChar = char.toLowerCase();
    // Always accept basic letters
    if (/^[a-z]$/.test(lowerChar)) {
      return true;
    }
    // Accept accented characters if enabled
    if (this.accentsEnabled && PORTUGUESE_ACCENTS.includes(lowerChar)) {
      return true;
    }
    return false;
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    // Handle letter input (A-Z and accented characters if enabled)
    if (this.isValidCharacter(key)) {
      event.preventDefault();
      this.inputLetter(key.toLowerCase());
      return;
    }

    // Handle Backspace
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.deleteLetter();
      return;
    }

    // Handle Enter (submit current row if full)
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submitRow();
      return;
    }
  }

  /**
   * Input a letter at the current position
   */
  private inputLetter(letter: string): void {
    if (this.inputLocked) return; // Input is locked
    if (this.currentRow >= 6) return; // No more rows
    if (this.currentCol >= this.wordLength) return; // Row is full

    // Set the letter
    this.letters[this.currentRow][this.currentCol] = letter;
    this.updateCell(this.currentRow, this.currentCol, true); // Animate letter input

    // Advance position
    this.currentCol++;

    // Fire onChange callback for real-time filtering
    this.fireOnChange();
  }

  /**
   * Delete the last letter, allowing backspace across rows
   * Does not allow editing submitted rows
   */
  private deleteLetter(): void {
    if (this.inputLocked) return; // Input is locked

    // If at start of current row and not row 0, move back to previous row
    // Only allow if previous row is NOT submitted
    if (this.currentCol === 0 && this.currentRow > 0 && !this.submittedRows.has(this.currentRow - 1)) {
      this.currentRow--;
      this.currentCol = this.wordLength; // Move to end of previous row
    }

    // If still at start of row (couldn't go back), nothing to delete
    if (this.currentCol === 0) return;

    // Move back
    this.currentCol--;

    // Clear the letter and reset color
    this.letters[this.currentRow][this.currentCol] = '';
    this.colors[this.currentRow][this.currentCol] = 'gray';
    this.updateCell(this.currentRow, this.currentCol);

    // Fire onChange callback for real-time filtering
    this.fireOnChange();
  }

  /**
   * Submit the current row (if full)
   */
  private submitRow(): void {
    if (this.currentRow >= 6) return;
    if (this.currentCol !== this.wordLength) return; // Row not full

    // Call the callback if set
    if (this.onSubmitCallback) {
      this.onSubmitCallback(this.currentRow);
    }
  }

  /**
   * Update a cell's display
   */
  private updateCell(row: number, col: number, animate: boolean = false): void {
    const cell = this.cells[row][col];
    const letter = this.letters[row][col];
    const color = this.colors[row][col];

    // Update letter
    cell.textContent = letter;

    // Update color and filled classes
    cell.classList.remove('cell-gray', 'cell-yellow', 'cell-green', 'cell-filled');
    if (letter) {
      cell.classList.add(`cell-${color}`);
      // Add filled class for cells with letters but default gray color
      if (color === 'gray') {
        cell.classList.add('cell-filled');
      }
    }

    // Trigger pop animation when letter is added
    if (animate && letter) {
      cell.classList.remove('cell-pop');
      // Force reflow to restart animation
      void cell.offsetWidth;
      cell.classList.add('cell-pop');
    }
  }

  /**
   * Set callback for row submission
   */
  public onSubmit(callback: (row: number) => void): void {
    this.onSubmitCallback = callback;
  }

  /**
   * Set callback for grid changes (letter typed, deleted, or color changed)
   */
  public onChange(callback: () => void): void {
    this.onChangeCallback = callback;
  }

  /**
   * Fire the onChange callback if set
   */
  private fireOnChange(): void {
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }

  /**
   * Shake a row to indicate invalid word
   */
  public shakeRow(row: number): void {
    if (row < 0 || row >= 6) return;

    const rowElement = this.gridElement.querySelector(
      `.guess-row[data-row="${row}"]`
    ) as HTMLElement | null;
    if (!rowElement) return;

    // Remove class first to allow re-triggering
    rowElement.classList.remove('row-shake');
    // Force reflow
    void rowElement.offsetWidth;
    // Add shake class
    rowElement.classList.add('row-shake');

    // Remove class after animation completes
    setTimeout(() => {
      rowElement.classList.remove('row-shake');
    }, 300);
  }

  /**
   * Advance to the next row (called externally after processing guess)
   */
  public advanceToNextRow(): void {
    if (this.currentRow < 5) {
      this.currentRow++;
      this.currentCol = 0;
    }
  }

  /**
   * Lock input to prevent further typing (used when game ends)
   */
  public lockInput(): void {
    this.inputLocked = true;
  }

  /**
   * Enable or disable game mode
   * In game mode, clicking cells does not cycle colors
   */
  public setGameMode(enabled: boolean): void {
    this.gameMode = enabled;
  }

  /**
   * Set colors for a completed row (used in game mode)
   * @param row - Row index
   * @param colors - Array of 5 LetterStatus values
   */
  public setRowColors(row: number, colors: LetterStatus[]): void {
    if (row < 0 || row >= 6) return;
    if (colors.length !== this.wordLength) return;

    // Apply colors with staggered flip animation
    for (let col = 0; col < this.wordLength; col++) {
      const delay = col * 100; // 100ms stagger per cell
      setTimeout(() => {
        this.colors[row][col] = colors[col];
        // Add flip animation class
        const cell = this.cells[row][col];
        cell.classList.add('cell-flip');
        this.updateCell(row, col);
        // Remove animation class after it completes
        setTimeout(() => {
          cell.classList.remove('cell-flip');
        }, 500);
      }, delay);
    }
  }

  /**
   * Mark a row as submitted (prevents backspace from editing it)
   * @param row - Row index to mark as submitted
   */
  public markRowSubmitted(row: number): void {
    if (row >= 0 && row < 6) {
      this.submittedRows.add(row);
    }
  }

  /**
   * Get the current row index
   */
  public getCurrentRow(): number {
    return this.currentRow;
  }

  /**
   * Get the current column index
   */
  public getCurrentCol(): number {
    return this.currentCol;
  }

  /**
   * Check if current row is complete (all 5 letters filled)
   */
  public isCurrentRowComplete(): boolean {
    return this.currentCol === this.wordLength;
  }

  /**
   * Get the word in the current row
   */
  public getCurrentWord(): string {
    return this.letters[this.currentRow].join('');
  }

  /**
   * Get the partial word typed in the current row (0-4 letters)
   * Returns empty string if row is complete (5 letters)
   */
  public getCurrentPartialWord(): string {
    // If row is complete, return empty (not a partial word)
    if (this.currentCol === this.wordLength) return '';
    // Return letters typed so far in current row
    return this.letters[this.currentRow].slice(0, this.currentCol).join('');
  }

  /**
   * Get guess feedback for a specific row
   */
  public getGuessFeedback(row: number): GuessFeedback | null {
    if (row < 0 || row >= 6) return null;

    // Check if row is complete
    const rowLetters = this.letters[row];
    if (rowLetters.some((l) => l === '')) return null;

    const feedback: LetterFeedback[] = [];
    for (let i = 0; i < this.wordLength; i++) {
      feedback.push({
        letter: rowLetters[i],
        position: i,
        status: this.colors[row][i],
      });
    }

    return feedback as GuessFeedback;
  }

  /**
   * Get feedback for all complete rows (rows with 5 letters)
   * Returns array of GuessFeedback for all rows from 0 through the highest row with letters
   */
  public getAllFeedback(): GuessFeedback[] {
    const allFeedback: GuessFeedback[] = [];

    // Check all rows that might have content
    for (let row = 0; row < 6; row++) {
      const feedback = this.getGuessFeedback(row);
      if (feedback) {
        allFeedback.push(feedback);
      }
    }

    return allFeedback;
  }

  /**
   * Reset the grid to initial state (clear all cells, colors, return to row 0)
   */
  public reset(): void {
    // Reset position
    this.currentRow = 0;
    this.currentCol = 0;

    // Unlock input
    this.inputLocked = false;

    // Clear submitted rows tracking
    this.submittedRows.clear();

    // Clear all state arrays and update cells
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < this.wordLength; col++) {
        this.letters[row][col] = '';
        this.colors[row][col] = 'gray';
        this.updateCell(row, col);
      }
    }

    // Re-focus the grid
    this.focusGrid();
  }

  /**
   * Clear the current row (remove all letters, reset colors)
   */
  public clearCurrentRow(): void {
    if (this.inputLocked) return;

    // Clear all letters and colors in current row
    for (let col = 0; col < this.wordLength; col++) {
      this.letters[this.currentRow][col] = '';
      this.colors[this.currentRow][col] = 'gray';
      this.updateCell(this.currentRow, col);
    }

    // Reset column position to start
    this.currentCol = 0;
  }

  /**
   * Fill the current row with a word (used for click-to-insert from suggestions)
   * @param word - 5-letter lowercase word to fill
   */
  public fillCurrentRow(word: string): void {
    if (this.inputLocked) return;
    if (word.length !== this.wordLength) return;

    // Clear current row first
    this.clearCurrentRow();

    // Fill in each letter with animation
    for (let col = 0; col < this.wordLength; col++) {
      this.letters[this.currentRow][col] = word[col].toLowerCase();
      this.updateCell(this.currentRow, col, true); // Animate
    }

    // Set position to end of row
    this.currentCol = this.wordLength;

    // Fire onChange callback
    this.fireOnChange();
  }

  /**
   * Handle a key press from the on-screen keyboard
   * @param key - The key pressed ('a'-'z', accented chars, 'Enter', or 'Backspace')
   */
  public handleKeyPress(key: string): void {
    if (key === 'Enter') {
      this.submitRow();
    } else if (key === 'Backspace') {
      this.deleteLetter();
    } else if (this.isValidCharacter(key)) {
      this.inputLetter(key.toLowerCase());
    }
  }

  /**
   * Enable or disable accented character input
   * When enabled, Portuguese accented characters are accepted
   */
  public setAccentsEnabled(enabled: boolean): void {
    this.accentsEnabled = enabled;
  }
}
