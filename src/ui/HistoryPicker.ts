import { getMinDate, getMaxDate, getPuzzleByDate } from '../data/history';
import type { HistoricalPuzzle } from '../types';

/**
 * History Picker component for selecting and loading past Wordle puzzles.
 * Uses native date input with constraints for valid puzzle dates.
 */
export class HistoryPicker {
  private container: HTMLElement;
  private overlayElement: HTMLElement | null = null;
  private pickerElement: HTMLElement | null = null;
  private dateInput: HTMLInputElement | null = null;
  private loadButton: HTMLButtonElement | null = null;
  private statusEl: HTMLElement | null = null;
  private onPuzzleSelected: (puzzle: HistoricalPuzzle) => void;

  constructor(
    containerId: string,
    onPuzzleSelected: (puzzle: HistoricalPuzzle) => void
  ) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }
    this.container = container;
    this.onPuzzleSelected = onPuzzleSelected;
    this.createPicker();
  }

  /**
   * Create the picker HTML structure
   */
  private createPicker(): void {
    // Create overlay
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'history-picker-overlay hidden';

    // Create picker container
    this.pickerElement = document.createElement('div');
    this.pickerElement.className = 'history-picker';

    const minDate = getMinDate();
    const maxDate = getMaxDate();

    this.pickerElement.innerHTML = `
      <div class="history-picker-header">
        <h2 class="history-picker-title">Practice Mode</h2>
        <button class="history-picker-close" aria-label="Close practice picker">&times;</button>
      </div>
      <div class="history-picker-content">
        <label class="history-picker-label" for="history-date-input">
          Select a past puzzle:
        </label>
        <input
          type="date"
          id="history-date-input"
          class="history-picker-date"
          min="${minDate}"
          max="${maxDate}"
          value="${maxDate}"
        />
        <button class="history-picker-load">Load Puzzle</button>
        <div class="history-picker-status"></div>
      </div>
    `;

    // Append picker to overlay
    this.overlayElement.appendChild(this.pickerElement);

    // Append overlay to container
    this.container.appendChild(this.overlayElement);

    // Cache element references
    this.dateInput = this.pickerElement.querySelector('#history-date-input');
    this.loadButton = this.pickerElement.querySelector('.history-picker-load');
    this.statusEl = this.pickerElement.querySelector('.history-picker-status');

    // Set up event listeners
    const closeButton = this.pickerElement.querySelector('.history-picker-close');
    closeButton?.addEventListener('click', () => this.hide());

    this.loadButton?.addEventListener('click', () => this.loadPuzzle());

    // Also load puzzle on Enter key in date input
    this.dateInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.loadPuzzle();
      }
    });
  }

  /**
   * Load the puzzle for the selected date
   */
  private async loadPuzzle(): Promise<void> {
    if (!this.dateInput || !this.statusEl || !this.loadButton) return;

    const date = this.dateInput.value;
    if (!date) {
      this.showStatus('Please select a date', 'error');
      return;
    }

    // Disable button and show loading state
    this.loadButton.disabled = true;
    this.showStatus('Loading...', '');

    try {
      const puzzle = await getPuzzleByDate(date);

      if (!puzzle) {
        this.showStatus('Puzzle not found for this date', 'error');
        this.loadButton.disabled = false;
        return;
      }

      // Show success briefly then trigger callback
      this.showStatus(`Wordle #${puzzle.game} loaded!`, 'success');
      this.loadButton.disabled = false;

      // Small delay to show success message
      setTimeout(() => {
        this.onPuzzleSelected(puzzle);
      }, 300);
    } catch {
      this.showStatus('Failed to load puzzle. Please try again.', 'error');
      this.loadButton.disabled = false;
    }
  }

  /**
   * Show status message
   */
  private showStatus(message: string, type: 'error' | 'success' | ''): void {
    if (!this.statusEl) return;
    this.statusEl.textContent = message;
    this.statusEl.className = 'history-picker-status';
    if (type) {
      this.statusEl.classList.add(`status-${type}`);
    }
  }

  /**
   * Render/refresh the picker (update max date if needed)
   */
  public render(): void {
    if (this.dateInput) {
      const maxDate = getMaxDate();
      this.dateInput.max = maxDate;
      // Update value if current value is beyond max
      if (this.dateInput.value > maxDate) {
        this.dateInput.value = maxDate;
      }
    }
    // Clear any previous status
    if (this.statusEl) {
      this.statusEl.textContent = '';
      this.statusEl.className = 'history-picker-status';
    }
  }

  /**
   * Show the picker with fade-in animation
   */
  public show(): void {
    this.render();
    if (this.overlayElement) {
      this.overlayElement.classList.remove('hidden');
      // Trigger reflow to ensure animation plays
      void this.overlayElement.offsetHeight;
      this.overlayElement.classList.add('visible');
      // Focus the date input
      this.dateInput?.focus();
    }
  }

  /**
   * Hide the picker with fade-out animation
   */
  public hide(): void {
    if (this.overlayElement) {
      this.overlayElement.classList.remove('visible');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        this.overlayElement?.classList.add('hidden');
      }, 200);
    }
  }
}
