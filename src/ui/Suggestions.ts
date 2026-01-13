import type { RankedWord } from '../types';

/**
 * Suggestions panel displays ranked word suggestions to help solve Wordle.
 * Shows remaining word count and a scrollable list of top suggestions.
 */
export class Suggestions {
  private containerElement: HTMLElement;
  private countElement: HTMLElement | null = null;
  private listElement: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.render();
  }

  /**
   * Create the initial HTML structure for the suggestions panel
   */
  private render(): void {
    this.containerElement.innerHTML = `
      <div class="suggestions-panel">
        <div class="suggestions-header">
          <span class="suggestions-count">0 words remaining</span>
        </div>
        <div class="suggestions-message"></div>
        <ul class="suggestions-list"></ul>
      </div>
    `;

    this.countElement = this.containerElement.querySelector('.suggestions-count');
    this.listElement = this.containerElement.querySelector('.suggestions-list');
    this.messageElement = this.containerElement.querySelector('.suggestions-message');
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
