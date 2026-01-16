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
 * Callback type for key press events
 */
export type KeyPressCallback = (key: string) => void;

/**
 * Keyboard displays a QWERTY keyboard layout showing letter states.
 * Keys are colored based on guess feedback to help users track which letters
 * have been tried and their status.
 *
 * Keys are clickable for mobile input - tapping a key fires the onKeyPress callback.
 */
export class Keyboard {
  private containerElement: HTMLElement;
  private letterStates: Map<string, KeyStatus> = new Map();
  private keyPressCallback?: KeyPressCallback;

  // QWERTY keyboard layout with Enter and Backspace
  private static readonly ROWS = [
    'qwertyuiop',
    'asdfghjkl',
    ['Enter', ...'zxcvbnm'.split(''), 'Backspace'],
  ];

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.initializeStates();
    this.render();
    this.attachClickListeners();
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
        ${Keyboard.ROWS.map((row, index) => {
          const keys = typeof row === 'string' ? row.split('') : row;
          return `
          <div class="keyboard-row" data-row="${index}">
            ${keys
              .map((key) => {
                if (key === 'Enter') {
                  return `<div class="key key-action key-enter" data-key="Enter">Enter</div>`;
                }
                if (key === 'Backspace') {
                  return `<div class="key key-action key-backspace" data-key="Backspace">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                      <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
                    </svg>
                  </div>`;
                }
                const status = this.letterStates.get(key) || 'unused';
                return `<div class="key key-${status}" data-key="${key}" data-letter="${key}">${key.toUpperCase()}</div>`;
              })
              .join('')}
          </div>
        `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Attach click event listeners to keyboard keys
   */
  private attachClickListeners(): void {
    this.containerElement.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const keyElement = target.closest('.key') as HTMLElement | null;
      if (keyElement && this.keyPressCallback) {
        const key = keyElement.dataset.key;
        if (key) {
          this.keyPressCallback(key);
        }
      }
    });
  }

  /**
   * Set callback for key press events
   */
  public onKeyPress(callback: KeyPressCallback): void {
    this.keyPressCallback = callback;
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
