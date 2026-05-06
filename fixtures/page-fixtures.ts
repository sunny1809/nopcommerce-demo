import { test as base } from '@playwright/test';
import { HomePage } from '../pages';

/**
 * Custom test fixtures that automatically instantiate page objects.
 *
 * Usage in tests:
 *   import { test, expect } from '../fixtures/page-fixtures';
 *   test('example', async ({ homePage }) => { ... });
 */

// Declare the custom fixture types
type PageFixtures = {
  homePage: HomePage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect } from '@playwright/test';
