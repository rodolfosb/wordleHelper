/**
 * HintsPanel component for displaying progressive hints to help players.
 * Shows 6 hints that can be revealed sequentially by clicking eye icons.
 */
export class HintsPanel {
  private containerElement: HTMLElement;
  private panelElement: HTMLElement | null = null;
  private answer: string = '';
  private hintsRevealed: number = 0;
  private wordLength: number = 5;
  private isCollapsed: boolean = true;

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.createPanel();
  }

  /**
   * Generate 6 hints based on the answer word
   */
  private generateHints(answer: string): string[] {
    if (!answer) return [];

    const upperAnswer = answer.toUpperCase();
    // Use wordLength property for consistency (falls back to answer.length if not set)
    const length = this.wordLength || answer.length;

    // Count vowels
    const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
    const vowelCount = upperAnswer.split('').filter(c => vowels.has(c)).length;

    // Calculate positions for hints 4 and 5
    // Hint 4: 2nd position (index 1) if word length >= 4
    const hint4Position = length >= 4 ? 2 : 1;
    const hint4Letter = upperAnswer[hint4Position - 1];

    // Hint 5: middle position (floor(length/2)+1 for 1-indexed display)
    const hint5Index = Math.floor(length / 2);
    const hint5Position = hint5Index + 1;
    const hint5Letter = upperAnswer[hint5Index];

    return [
      `First letter: ${upperAnswer[0]}`,
      `Last letter: ${upperAnswer[length - 1]}`,
      `Contains ${vowelCount} vowel${vowelCount !== 1 ? 's' : ''}`,
      `Letter ${hint4Position}: ${hint4Letter}`,
      `Letter ${hint5Position}: ${hint5Letter}`,
      `The answer is: ${upperAnswer}`,
    ];
  }

  /**
   * Create the panel HTML structure
   */
  private createPanel(): void {
    this.panelElement = document.createElement('div');
    this.panelElement.className = 'hints-panel';
    this.render();
    this.containerElement.appendChild(this.panelElement);
  }

  /**
   * SVG icons for the panel
   */
  private getLightbulbIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
      <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
    </svg>`;
  }

  private getVisibilityOffIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
    </svg>`;
  }

  private getVisibilityIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>`;
  }

  /**
   * Toggle the collapsed state
   */
  private toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.render();
  }

  /**
   * Render the hints panel
   */
  public render(): void {
    if (!this.panelElement) return;

    const hints = this.generateHints(this.answer);
    const collapsedClass = this.isCollapsed ? 'collapsed' : '';
    const toggleIcon = this.isCollapsed ? '▶' : '▼';
    const toggleText = this.isCollapsed ? 'Show' : 'Hide';

    let hintsListHtml = '';
    for (let i = 0; i < 6; i++) {
      const isRevealed = i < this.hintsRevealed;
      const isNextToReveal = i === this.hintsRevealed;
      const isFinalHint = i === 5;

      const revealedClass = isRevealed ? 'revealed' : '';
      const finalClass = isRevealed && isFinalHint ? 'final-reveal' : '';
      const hintText = isRevealed && hints[i] ? hints[i] : `Hint ${i + 1}`;
      const textClass = isRevealed ? '' : 'hidden-hint';

      // Eye button: enabled only for the next hint to reveal
      const eyeIcon = isRevealed ? this.getVisibilityIcon() : this.getVisibilityOffIcon();
      const disabled = !isNextToReveal || !this.answer ? 'disabled' : '';

      hintsListHtml += `
        <div class="hint-item ${revealedClass} ${finalClass}">
          <button class="hint-eye-btn" data-hint="${i}" ${disabled} aria-label="${isRevealed ? 'Hint revealed' : 'Reveal hint'}">
            ${eyeIcon}
          </button>
          <span class="hint-text ${textClass}">${hintText}</span>
        </div>
      `;
    }

    this.panelElement.innerHTML = `
      <div class="hints-header">
        <span class="hints-title">${this.getLightbulbIcon()} Hints</span>
        <button class="hints-toggle" aria-expanded="${!this.isCollapsed}">
          <span class="toggle-icon">${toggleIcon}</span>
          <span class="toggle-text">${toggleText}</span>
        </button>
      </div>
      <div class="hints-body ${collapsedClass}">
        ${hintsListHtml}
      </div>
    `;

    // Attach click handlers to eye buttons and toggle
    this.attachEventHandlers();
  }

  /**
   * Attach click handlers to hint eye buttons and toggle
   */
  private attachEventHandlers(): void {
    if (!this.panelElement) return;

    // Toggle button click handler
    const toggleBtn = this.panelElement.querySelector('.hints-toggle');
    toggleBtn?.addEventListener('click', () => this.toggleCollapse());

    const eyeButtons = this.panelElement.querySelectorAll('.hint-eye-btn');
    eyeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const hintIndex = parseInt(target.dataset.hint || '0', 10);
        if (hintIndex === this.hintsRevealed) {
          this.revealNextHint();
        }
      });
    });
  }

  /**
   * Set the answer word and reset revealed hints
   */
  public setAnswer(answer: string): void {
    this.answer = answer.toLowerCase();
    this.hintsRevealed = 0;
    this.render();
  }

  /**
   * Set the word length (for dynamic hint positions)
   */
  public setWordLength(length: number): void {
    this.wordLength = length;
  }

  /**
   * Reset the hints panel (clear answer and revealed count)
   */
  public reset(): void {
    this.answer = '';
    this.hintsRevealed = 0;
    this.render();
  }

  /**
   * Reveal the next hint (increment hintsRevealed, max 6)
   */
  public revealNextHint(): void {
    if (this.hintsRevealed < 6) {
      this.hintsRevealed++;
      this.render();
    }
  }

  /**
   * Hide the hints panel
   */
  public hide(): void {
    if (this.panelElement) {
      this.panelElement.classList.add('hidden');
    }
  }

  /**
   * Show the hints panel
   */
  public show(): void {
    if (this.panelElement) {
      this.panelElement.classList.remove('hidden');
    }
  }
}
