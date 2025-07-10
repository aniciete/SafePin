import { test, expect } from '@playwright/test';

test.describe('Report Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as an authority user
    await page.goto('/login.html');
    await page.locator('#email').fill('authority@test.com');
    await page.locator('#password').fill('password123');
    await page.locator('form').evaluate(form => form.submit());
    await page.waitForURL('/authority-page/index.html', { timeout: 30000 });
  });

  test('allows an authority user to verify a report', async ({ page }) => {
    // Visit the authority dashboard
    await page.goto('/authority-page/index.html');

    // Find the first report and click the "Verify" button
    await page.locator('.report-item').first().locator('.verify-button').click();

    // Assert that the report is marked as verified
    await expect(page.locator('.report-item').first()).toContainText('Verified');
  });
});