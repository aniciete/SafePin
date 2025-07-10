import { test, expect } from '@playwright/test';

test.describe('Authority Login', () => {
  test('allows an authority user to log in', async ({ page }) => {
    // Visit the login page
    await page.goto('/login.html');

    // Fill in the credentials
    await page.locator('#email').fill('authority@test.com');
    await page.locator('#password').fill('password123');

    // Submit the form
    await page.locator('form').evaluate(form => form.submit());

    // Assert that the login was successful
    await expect(page).toHaveURL('/authority-page/index.html', { timeout: 30000 });
    await expect(page.locator('text=Welcome, Authority')).toBeVisible();
  });
});