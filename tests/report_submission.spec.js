import { test, expect } from '@playwright/test';

test.describe('Anonymous Report Submission', () => {
  test('allows a user to submit a report anonymously', async ({ page }) => {
    // Visit the report submission page
    await page.goto('/landing-page/report.html');

   // Wait for the map to be visible to ensure the page is fully loaded
   await page.waitForSelector('#map', { state: 'visible' });

    // Fill out the form
    await page.locator('#crime-type').selectOption('Theft');
    await page.locator('#description').fill('My bike was stolen from the park.');
    await page.locator('#attachment').setInputFiles('tests/fixtures/example.json');

    // Submit the form
    await page.locator('form').evaluate(form => form.submit());

    // Assert that the submission was successful
    await expect(page).toHaveURL('/submission-success', { timeout: 30000 });
    await expect(page.locator('text=Thank you for your report!')).toBeVisible();
  });
});