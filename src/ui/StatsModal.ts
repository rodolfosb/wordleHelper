import type { SessionStats } from '../types';
import { getWinRate } from '../logic/stats';

/**
 * Modal component for displaying session statistics.
 * Shows games played, win rate, streaks, and guess distribution.
 */
export class StatsModal {
  private containerElement: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.createModal();
  }

  /**
   * Create the modal HTML structure
   */
  private createModal(): void {
    // Create overlay
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'stats-modal-overlay hidden';

    // Create modal container
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'stats-modal';
    this.modalElement.innerHTML = `
      <div class="stats-modal-header">
        <h2 class="stats-modal-title">Statistics</h2>
        <button class="stats-modal-close" aria-label="Close statistics">&times;</button>
      </div>
      <div class="stats-modal-content">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value" data-stat="gamesPlayed">0</span>
            <span class="stat-label">Played</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" data-stat="winRate">0</span>
            <span class="stat-label">Win %</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" data-stat="currentStreak">0</span>
            <span class="stat-label">Current Streak</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" data-stat="maxStreak">0</span>
            <span class="stat-label">Max Streak</span>
          </div>
        </div>
        <div class="guess-distribution-section">
          <h3 class="distribution-title">Guess Distribution</h3>
          <div class="distribution-chart">
            ${[1, 2, 3, 4, 5, 6]
              .map(
                (n) => `
              <div class="distribution-row">
                <span class="distribution-label">${n}</span>
                <div class="distribution-bar-container">
                  <div class="distribution-bar" data-guess="${n}">
                    <span class="distribution-count">0</span>
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    // Append modal to overlay
    this.overlayElement.appendChild(this.modalElement);

    // Append overlay to container
    this.containerElement.appendChild(this.overlayElement);

    // Set up close button click handler
    const closeButton = this.modalElement.querySelector('.stats-modal-close');
    closeButton?.addEventListener('click', () => this.hide());
  }

  /**
   * Render stats data to the modal
   */
  public render(stats: SessionStats): void {
    if (!this.modalElement) return;

    // Update stat values
    const gamesPlayedEl = this.modalElement.querySelector('[data-stat="gamesPlayed"]');
    const winRateEl = this.modalElement.querySelector('[data-stat="winRate"]');
    const currentStreakEl = this.modalElement.querySelector('[data-stat="currentStreak"]');
    const maxStreakEl = this.modalElement.querySelector('[data-stat="maxStreak"]');

    if (gamesPlayedEl) gamesPlayedEl.textContent = stats.gamesPlayed.toString();
    if (winRateEl) winRateEl.textContent = getWinRate(stats).toString();
    if (currentStreakEl) currentStreakEl.textContent = stats.currentStreak.toString();
    if (maxStreakEl) maxStreakEl.textContent = stats.maxStreak.toString();

    // Update guess distribution bars
    const maxDistribution = Math.max(...stats.guessDistribution, 1); // At least 1 to avoid division by zero

    stats.guessDistribution.forEach((count, index) => {
      const bar = this.modalElement?.querySelector(
        `.distribution-bar[data-guess="${index + 1}"]`
      ) as HTMLElement | null;
      const countSpan = bar?.querySelector('.distribution-count');

      if (bar) {
        // Calculate percentage width (minimum 8% so count is visible when 0)
        const percentage = count > 0 ? Math.max((count / maxDistribution) * 100, 8) : 8;
        bar.style.width = `${percentage}%`;

        // Highlight bar if there are wins at this guess count
        if (count > 0) {
          bar.classList.add('has-wins');
        } else {
          bar.classList.remove('has-wins');
        }
      }

      if (countSpan) {
        countSpan.textContent = count.toString();
      }
    });
  }

  /**
   * Show the modal with fade-in animation
   */
  public show(): void {
    if (this.overlayElement) {
      this.overlayElement.classList.remove('hidden');
      // Trigger reflow to ensure animation plays
      void this.overlayElement.offsetHeight;
      this.overlayElement.classList.add('visible');
    }
  }

  /**
   * Hide the modal with fade-out animation
   */
  public hide(): void {
    if (this.overlayElement) {
      this.overlayElement.classList.remove('visible');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        this.overlayElement?.classList.add('hidden');
        this.onCloseCallback?.();
      }, 200);
    }
  }

  /**
   * Set callback for when modal is closed
   */
  public set onClose(callback: () => void) {
    this.onCloseCallback = callback;
  }
}
