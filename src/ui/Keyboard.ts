import type { GuessFeedback } from '../types';

/**
 * Key status for keyboard display
 * - unused: letter not yet used in any guess
 * - absent: letter confirmed not in word (gray)
 * - present: letter in word but position unknown (yellow)
 * - correct: letter in correct position (green)
 */
export type KeyStatus = 'unused' | 'absent' | 'present' | 'correct';

/**
 * Keyboard displays a QWERTY keyboard layout showing letter states.
 * Keys are colored based on guess feedback to help users track which letters
 * have been tried and their status.
 *
 * This is display-only - not clickable for input.
 */
export class Keyboard {
  private containerElement: HTMLElement;
  private letterStates: Map<string, KeyStatus> = new Map();

  // QWERTY keyboard layout
  private static readonly ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.initializeStates();
    this.render();
  }

  /**
   * Initialize all letter states to 'unused'
   */
  private initializeStates(): void {
    for (const row of Keyboard.ROWS) {
      for (const letter of row) {
        this.letterStates.set(letter, 'unused');
      }
    }
  }

  /**
   * Render the keyboard HTML
   */
  private render(): void {
    this.containerElement.innerHTML = `
      <div class="keyboard">
        ${Keyboard.ROWS.map(
          (row, index) => `
          <div class="keyboard-row" data-row="${index}">
            ${row
              .split('')
              .map((letter) => {
                const status = this.letterStates.get(letter) || 'unused';
                return `<div class="key key-${status}" data-letter="${letter}">${letter.toUpperCase()}</div>`;
              })
              .join('')}
          </div>
        `
        ).join('')}
      </div>
    `;
  }

  /**
   * Update letter states based on guess feedback
   * Priority: correct > present > absent
   * Once a letter is marked correct, it stays correct
   * Once a letter is marked present, it only changes to correct
   */
  public updateFromFeedback(feedback: GuessFeedback): void {
    for (const letterFeedback of feedback) {
      const letter = letterFeedback.letter.toLowerCase();
      const currentStatus = this.letterStates.get(letter) || 'unused';

      // Map Wordle status to keyboard status
      let newStatus: KeyStatus;
      if (letterFeedback.status === 'green') {
        newStatus = 'correct';
      } else if (letterFeedback.status === 'yellow') {
        newStatus = 'present';
      } else {
        newStatus = 'absent';
      }

      // Apply priority: correct > present > absent > unused
      const statusPriority: Record<KeyStatus, number> = {
        unused: 0,
        absent: 1,
        present: 2,
        correct: 3,
      };

      // Only upgrade status (never downgrade)
      if (statusPriority[newStatus] > statusPriority[currentStatus]) {
        this.letterStates.set(letter, newStatus);
      }
    }

    // Update the DOM
    this.updateKeyElements();
  }

  /**
   * Update the DOM to reflect current letter states
   */
  private updateKeyElements(): void {
    for (const [letter, status] of this.letterStates) {
      const keyElement = this.containerElement.querySelector(
        `.key[data-letter="${letter}"]`
      ) as HTMLElement | null;
      if (keyElement) {
        // Remove all status classes
        keyElement.classList.remove(
          'key-unused',
          'key-absent',
          'key-present',
          'key-correct'
        );
        // Add current status class
        keyElement.classList.add(`key-${status}`);
      }
    }
  }

  /**
   * Reset all letter states to 'unused'
   */
  public reset(): void {
    for (const key of this.letterStates.keys()) {
      this.letterStates.set(key, 'unused');
    }
    this.updateKeyElements();
  }
}
