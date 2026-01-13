import type { LetterStatus, GuessFeedback, LetterFeedback } from '../types';

/**
 * GuessGrid manages the input state and DOM updates for the 6x5 guess grid.
 * Handles keyboard input for letters and provides an interface for getting guess feedback.
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

  constructor(gridElement: HTMLElement) {
    this.gridElement = gridElement;
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
    for (let row = 0; row < 6; row++) {
      this.letters[row] = ['', '', '', '', ''];
      this.colors[row] = ['gray', 'gray', 'gray', 'gray', 'gray'];
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
    if (row < 0 || row >= 6) return;
    if (col < 0 || col >= 5) return;

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
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toUpperCase();

    // Handle letter input (A-Z)
    if (/^[A-Z]$/.test(key)) {
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
    if (this.currentRow >= 6) return; // No more rows
    if (this.currentCol >= 5) return; // Row is full

    // Set the letter
    this.letters[this.currentRow][this.currentCol] = letter;
    this.updateCell(this.currentRow, this.currentCol);

    // Advance position
    this.currentCol++;

    // Fire onChange callback for real-time filtering
    this.fireOnChange();
  }

  /**
   * Delete the last letter, allowing backspace across rows
   */
  private deleteLetter(): void {
    // If at start of current row and not row 0, move back to previous row
    if (this.currentCol === 0 && this.currentRow > 0) {
      this.currentRow--;
      this.currentCol = 5; // Move to end of previous row
    }

    // If still nothing to delete (row 0, col 0), return
    if (this.currentCol <= 0 && this.currentRow === 0) return;

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
    if (this.currentCol !== 5) return; // Row not full

    // Call the callback if set
    if (this.onSubmitCallback) {
      this.onSubmitCallback(this.currentRow);
    }
  }

  /**
   * Update a cell's display
   */
  private updateCell(row: number, col: number): void {
    const cell = this.cells[row][col];
    const letter = this.letters[row][col];
    const color = this.colors[row][col];

    // Update letter
    cell.textContent = letter;

    // Update color classes
    cell.classList.remove('cell-gray', 'cell-yellow', 'cell-green');
    if (letter) {
      cell.classList.add(`cell-${color}`);
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
   * Advance to the next row (called externally after processing guess)
   */
  public advanceToNextRow(): void {
    if (this.currentRow < 5) {
      this.currentRow++;
      this.currentCol = 0;
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
    return this.currentCol === 5;
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
    if (this.currentCol === 5) return '';
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
    for (let i = 0; i < 5; i++) {
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

    // Clear all state arrays and update cells
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        this.letters[row][col] = '';
        this.colors[row][col] = 'gray';
        this.updateCell(row, col);
      }
    }

    // Re-focus the grid
    this.focusGrid();
  }
}
