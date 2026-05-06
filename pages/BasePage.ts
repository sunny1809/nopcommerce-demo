import { type Page, type Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all page objects.
 *
 * Provides shared navigation, wait, and assertion helpers
 * so individual page objects stay focused on their own elements.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────

  /** Navigate to a path relative to the baseURL configured in playwright.config.ts */
  async navigate(path: string = '/') {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /** Wait until the DOM is fully parsed */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Wait until all network requests have settled */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  // ── Common element helpers ──────────────────────────────────

  /** Return the current page title */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Return the current page URL */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /** Click an element and optionally wait for navigation */
  async clickElement(locator: Locator, waitForNav = false) {
    if (waitForNav) {
      await Promise.all([
        this.page.waitForLoadState('domcontentloaded'),
        locator.click(),
      ]);
    } else {
      await locator.click();
    }
  }

  /** Type text into an input field (clears existing value first) */
  async fillInput(locator: Locator, text: string) {
    await locator.clear();
    await locator.fill(text);
  }

  /** Assert that an element is visible on the page */
  async assertVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  /** Assert that an element contains expected text */
  async assertText(locator: Locator, expected: string) {
    await expect(locator).toContainText(expected);
  }

  /** Get the count of elements matching a locator */
  async getElementCount(locator: Locator): Promise<number> {
    return locator.count();
  }

  /** Collect all visible text values from a list of matching elements */
  async getAllTexts(locator: Locator): Promise<string[]> {
    return locator.allTextContents();
  }
}
