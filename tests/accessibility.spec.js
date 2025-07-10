import { test, expect } from '@playwright/test';

test.describe('General Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('html has lang attribute', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});