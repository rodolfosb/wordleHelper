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
    if (row < 0 || row > this.currentRow) return; // Can only click current or past rows
    if (col < 0 || col >= 5) return;

    // Only allow color change on cells that have letters
    if (!this.letters[row][col]) return;

    // Cycle through colors: gray -> yellow -> green -> gray
    this.cycleColor(row, col);
    this.updateCell(row, col);
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
  private focusGrid(): void {
    this.gridElement.focus();
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
  }

  /**
   * Delete the last letter in the current row
   */
  private deleteLetter(): void {
    if (this.currentRow >= 6) return;
    if (this.currentCol <= 0) return; // Nothing to delete

    // Move back
    this.currentCol--;

    // Clear the letter and reset color
    this.letters[this.currentRow][this.currentCol] = '';
    this.colors[this.currentRow][this.currentCol] = 'gray';
    this.updateCell(this.currentRow, this.currentCol);
  }

  /**
   * Submit the current row (if full)
   */
  private submitRow(): void {
    if (this.currentRow >= 6) return;
    if (this.currentCol !== 5) return; // Row not full

    console.log(`Submitting row ${this.currentRow}: ${this.letters[this.currentRow].join('')}`);

    // Call the callback if set
    if (this.onSubmitCallback) {
      this.onSubmitCallback(this.currentRow);
    }

    // Note: We do NOT advance to next row here - that will be wired in Plan 02
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
}
