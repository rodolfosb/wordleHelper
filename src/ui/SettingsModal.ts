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
      showHints: true,
      hardMode: false,
      nytMode: true,
      wordLength: 5,
      wordLanguage: 'en',
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
        <div class="settings-item">
          <div class="settings-label">
            <span class="settings-name">Show Hints</span>
            <span class="settings-description">Display hints panel for progressive clues</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="setting-show-hints" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-item">
          <div class="settings-label">
            <span class="settings-name">NYT Mode</span>
            <span class="settings-description">Follow official NYT daily puzzle</span>
          </div>
          <label class="settings-toggle">
            <input type="checkbox" id="setting-nyt-mode" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-item">
          <div class="settings-label">
            <span class="settings-name">Word Length</span>
            <span class="settings-description" id="word-length-description">Number of letters for Open Mode games</span>
          </div>
          <select id="setting-word-length" class="settings-select">
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div class="settings-item">
          <div class="settings-label">
            <span class="settings-name">Word Language</span>
            <span class="settings-description" id="word-language-description">Language for Open Mode words</span>
          </div>
          <select id="setting-word-language" class="settings-select">
            <option value="en">English</option>
            <option value="pt">Portugues</option>
          </select>
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
    const showHintsToggle = this.modalElement.querySelector('#setting-show-hints') as HTMLInputElement;
    const nytModeToggle = this.modalElement.querySelector('#setting-nyt-mode') as HTMLInputElement;
    const wordLengthSelect = this.modalElement.querySelector('#setting-word-length') as HTMLSelectElement;

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

    showHintsToggle?.addEventListener('change', () => {
      this.currentSettings.showHints = showHintsToggle.checked;
      this.notifySettingsChange();
    });

    nytModeToggle?.addEventListener('change', () => {
      this.currentSettings.nytMode = nytModeToggle.checked;
      // Update word length selector enabled state
      this.updateWordLengthSelectorState();
      this.notifySettingsChange();
    });

    wordLengthSelect?.addEventListener('change', () => {
      this.currentSettings.wordLength = parseInt(wordLengthSelect.value, 10);
      this.notifySettingsChange();
    });

    const wordLanguageSelect = this.modalElement.querySelector('#setting-word-language') as HTMLSelectElement;

    wordLanguageSelect?.addEventListener('change', () => {
      this.currentSettings.wordLanguage = wordLanguageSelect.value as 'en' | 'pt';
      this.updateWordLengthSelectorState();
      this.notifySettingsChange();
    });
  }

  /**
   * Update the word length and language selectors' enabled/disabled state based on NYT mode
   */
  private updateWordLengthSelectorState(): void {
    if (!this.modalElement) return;

    const wordLengthSelect = this.modalElement.querySelector('#setting-word-length') as HTMLSelectElement;
    const wordLengthDescription = this.modalElement.querySelector('#word-length-description') as HTMLSpanElement;
    const wordLanguageSelect = this.modalElement.querySelector('#setting-word-language') as HTMLSelectElement;
    const wordLanguageDescription = this.modalElement.querySelector('#word-language-description') as HTMLSpanElement;

    // Word length: enabled unless NYT Mode is on
    if (wordLengthSelect) {
      wordLengthSelect.disabled = this.currentSettings.nytMode;
    }

    if (wordLengthDescription) {
      if (this.currentSettings.nytMode) {
        wordLengthDescription.textContent = 'NYT Mode uses 5 letters';
      } else {
        wordLengthDescription.textContent = 'Number of letters for Open Mode games';
      }
    }

    // Word language: disabled if NYT Mode (always English)
    if (wordLanguageSelect) {
      wordLanguageSelect.disabled = this.currentSettings.nytMode;
    }

    if (wordLanguageDescription) {
      if (this.currentSettings.nytMode) {
        wordLanguageDescription.textContent = 'NYT Mode uses English words';
      } else {
        wordLanguageDescription.textContent = 'Language for Open Mode words';
      }
    }
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
    const showHintsToggle = this.modalElement.querySelector('#setting-show-hints') as HTMLInputElement;
    const nytModeToggle = this.modalElement.querySelector('#setting-nyt-mode') as HTMLInputElement;
    const wordLengthSelect = this.modalElement.querySelector('#setting-word-length') as HTMLSelectElement;

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

    if (showHintsToggle) {
      showHintsToggle.checked = settings.showHints;
    }

    if (nytModeToggle) {
      nytModeToggle.checked = settings.nytMode;
    }

    if (wordLengthSelect) {
      wordLengthSelect.value = String(settings.wordLength);
    }

    const wordLanguageSelect = this.modalElement.querySelector('#setting-word-language') as HTMLSelectElement;
    if (wordLanguageSelect) {
      wordLanguageSelect.value = settings.wordLanguage;
    }

    // Update word length and language selector enabled state
    this.updateWordLengthSelectorState();
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
