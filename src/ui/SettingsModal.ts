import type { AppSettings } from '../types';

/**
 * Modal component for managing application settings.
 * Provides toggle switches for theme, suggestions visibility, and hard mode.
 */
export class SettingsModal {
  private containerElement: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private overlayElement: HTMLElement | null = null;
  private onSettingsChangeCallback: ((settings: AppSettings) => void) | null = null;
  private currentSettings: AppSettings;

  constructor(
    containerElement: HTMLElement,
    onSettingsChange?: (settings: AppSettings) => void
  ) {
    this.containerElement = containerElement;
    this.onSettingsChangeCallback = onSettingsChange || null;
    this.currentSettings = {
      theme: 'system',
      showSuggestions: true,
      hardMode: false,
    };
    this.createModal();
  }

  /**
   * Create the modal HTML structure
   */
  private createModal(): void {
    // Create overlay
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'settings-modal-overlay hidden';

    // Create modal container
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'settings-modal';
    this.modalElement.innerHTML = `
      <div class="settings-modal-header">
        <h2 class="settings-modal-title">Settings</h2>
        <button class="settings-modal-close" aria-label="Close settings">&times;</button>
      </div>
      <div class="settings-modal-content">
        <div class="settings-item">
          <div class="settings-label">
            <span class="settings-name">Dark Theme</span>
            <span class="settings-description">Toggle between light and dark mode</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="setting-dark-theme" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-item">
          <div class="settings-label">
            <span class="settings-name">Hard Mode</span>
            <span class="settings-description">Guesses must use revealed hints</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="setting-hard-mode" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-item">
          <div class="settings-label">
            <span class="settings-name">Show Suggestions</span>
            <span class="settings-description">Display word suggestions panel</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="setting-show-suggestions" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    `;

    // Append modal to overlay
    this.overlayElement.appendChild(this.modalElement);

    // Append overlay to container
    this.containerElement.appendChild(this.overlayElement);

    // Set up close button click handler
    const closeButton = this.modalElement.querySelector('.settings-modal-close');
    closeButton?.addEventListener('click', () => this.hide());

    // Set up overlay click to close (click outside modal)
    this.overlayElement.addEventListener('click', (e) => {
      if (e.target === this.overlayElement) {
        this.hide();
      }
    });

    // Set up toggle change handlers
    this.setupToggleHandlers();
  }

  /**
   * Set up event handlers for toggle switches
   */
  private setupToggleHandlers(): void {
    if (!this.modalElement) return;

    const darkThemeToggle = this.modalElement.querySelector('#setting-dark-theme') as HTMLInputElement;
    const hardModeToggle = this.modalElement.querySelector('#setting-hard-mode') as HTMLInputElement;
    const showSuggestionsToggle = this.modalElement.querySelector('#setting-show-suggestions') as HTMLInputElement;

    darkThemeToggle?.addEventListener('change', () => {
      this.currentSettings.theme = darkThemeToggle.checked ? 'dark' : 'light';
      this.notifySettingsChange();
    });

    hardModeToggle?.addEventListener('change', () => {
      this.currentSettings.hardMode = hardModeToggle.checked;
      this.notifySettingsChange();
    });

    showSuggestionsToggle?.addEventListener('change', () => {
      this.currentSettings.showSuggestions = showSuggestionsToggle.checked;
      this.notifySettingsChange();
    });
  }

  /**
   * Notify callback about settings change
   */
  private notifySettingsChange(): void {
    if (this.onSettingsChangeCallback) {
      this.onSettingsChangeCallback({ ...this.currentSettings });
    }
  }

  /**
   * Render settings to the modal
   */
  public render(settings: AppSettings): void {
    if (!this.modalElement) return;

    this.currentSettings = { ...settings };

    // Update toggle states
    const darkThemeToggle = this.modalElement.querySelector('#setting-dark-theme') as HTMLInputElement;
    const hardModeToggle = this.modalElement.querySelector('#setting-hard-mode') as HTMLInputElement;
    const showSuggestionsToggle = this.modalElement.querySelector('#setting-show-suggestions') as HTMLInputElement;

    if (darkThemeToggle) {
      // Dark theme toggle is checked when theme is 'dark' or when 'system' preference is dark
      darkThemeToggle.checked = settings.theme === 'dark' ||
        (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    if (hardModeToggle) {
      hardModeToggle.checked = settings.hardMode;
    }

    if (showSuggestionsToggle) {
      showSuggestionsToggle.checked = settings.showSuggestions;
    }
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
      }, 200);
    }
  }

  /**
   * Get current settings
   */
  public getSettings(): AppSettings {
    return { ...this.currentSettings };
  }

  /**
   * Set the settings change callback
   */
  public set onSettingsChange(callback: (settings: AppSettings) => void) {
    this.onSettingsChangeCallback = callback;
  }
}
