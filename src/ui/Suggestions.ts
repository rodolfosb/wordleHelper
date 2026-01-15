import type { RankedWord } from '../types';

/**
 * Suggestions panel displays ranked word suggestions to help solve Wordle.
 * Shows remaining word count and a scrollable list of top suggestions.
 * Supports clicking a suggestion to auto-fill it in the grid.
 */
export class Suggestions {
  private containerElement: HTMLElement;
  private countElement: HTMLElement | null = null;
  private listElement: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;
  private toggleElement: HTMLElement | null = null;
  private isCollapsed: boolean = true;
  private wordClickCallback?: (word: string) => void;

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.render();
  }

  /**
   * Set callback for when a suggestion word is clicked
   */
  public onWordClick(callback: (word: string) => void): void {
    this.wordClickCallback = callback;
  }

  /**
   * Create the initial HTML structure for the suggestions panel
   */
  private render(): void {
    this.containerElement.innerHTML = `
      <div class="suggestions-panel">
        <div class="suggestions-header">
          <span class="suggestions-count">0 words remaining</span>
          <button class="suggestions-toggle" aria-expanded="false">
            <span class="toggle-icon">▶</span>
            <span class="toggle-text">Show</span>
          </button>
        </div>
        <div class="suggestions-body collapsed">
          <div class="suggestions-message"></div>
          <ul class="suggestions-list"></ul>
        </div>
      </div>
    `;

    this.countElement = this.containerElement.querySelector('.suggestions-count');
    this.listElement = this.containerElement.querySelector('.suggestions-list');
    this.messageElement = this.containerElement.querySelector('.suggestions-message');
    this.toggleElement = this.containerElement.querySelector('.suggestions-toggle');

    // Set up toggle click handler
    this.toggleElement?.addEventListener('click', () => this.toggleCollapse());

    // Set up click handler for suggestions list (event delegation)
    this.listElement?.addEventListener('click', (event) => {
      this.handleListClick(event);
    });
  }

  /**
   * Handle click events on the suggestions list using event delegation
   */
  private handleListClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Find the suggestion-item parent (could click on word, score, or item itself)
    const item = target.closest('.suggestion-item');
    if (!item) return;

    // Find the word element within the item
    const wordElement = item.querySelector('.suggestion-word');
    if (!wordElement) return;

    // Extract the word (displayed in uppercase, convert to lowercase)
    const word = wordElement.textContent?.toLowerCase().trim();
    if (!word) return;

    // Call the callback if set
    if (this.wordClickCallback) {
      this.wordClickCallback(word);
    }
  }

  /**
   * Toggle the collapsed state of the suggestions list
   */
  private toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.updateCollapseState();
  }

  /**
   * Update the DOM to reflect the collapsed state
   */
  private updateCollapseState(): void {
    const body = this.containerElement.querySelector('.suggestions-body');
    const toggleIcon = this.containerElement.querySelector('.toggle-icon');
    const toggleText = this.containerElement.querySelector('.toggle-text');

    if (body) {
      if (this.isCollapsed) {
        body.classList.add('collapsed');
      } else {
        body.classList.remove('collapsed');
      }
    }

    if (toggleIcon) {
      toggleIcon.textContent = this.isCollapsed ? '▶' : '▼';
    }

    if (toggleText) {
      toggleText.textContent = this.isCollapsed ? 'Show' : 'Hide';
    }

    if (this.toggleElement) {
      this.toggleElement.setAttribute('aria-expanded', (!this.isCollapsed).toString());
    }
  }

  /**
   * Update the suggestions display with new ranked words
   * @param rankedWords - Array of ranked words sorted by score descending
   * @param remainingCount - Total count of remaining possible words
   */
  public update(rankedWords: RankedWord[], remainingCount: number): void {
    // Update count
    if (this.countElement) {
      const wordText = remainingCount === 1 ? 'word' : 'words';
      this.countElement.textContent = `${remainingCount} ${wordText} remaining`;
    }

    // Handle special messages
    if (this.messageElement) {
      if (remainingCount === 0) {
        this.messageElement.textContent = 'No matches found';
        this.messageElement.className = 'suggestions-message message-error';
      } else if (remainingCount === 1) {
        this.messageElement.textContent = 'Answer found!';
        this.messageElement.className = 'suggestions-message message-success';
      } else {
        this.messageElement.textContent = '';
        this.messageElement.className = 'suggestions-message';
      }
    }

    // Update list with top 20 suggestions
    if (this.listElement) {
      const topWords = rankedWords.slice(0, 20);
      this.listElement.innerHTML = topWords
        .map((item, index) => {
          const scorePercent = Math.round(item.score * 100);
          const isTop3 = index < 3;
          const itemClass = isTop3 ? 'suggestion-item top-suggestion' : 'suggestion-item';

          return `
            <li class="${itemClass}">
              <span class="suggestion-word">${item.word.toUpperCase()}</span>
              <span class="suggestion-score">
                <span class="score-bar" style="width: ${scorePercent}%"></span>
                <span class="score-text">${scorePercent}%</span>
              </span>
            </li>
          `;
        })
        .join('');
    }
  }

  /**
   * Reset the suggestions panel to initial state
   */
  public reset(): void {
    if (this.countElement) {
      this.countElement.textContent = '0 words remaining';
    }
    if (this.messageElement) {
      this.messageElement.textContent = '';
      this.messageElement.className = 'suggestions-message';
    }
    if (this.listElement) {
      this.listElement.innerHTML = '';
    }
  }
}
