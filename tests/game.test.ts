import { test, expect } from '@playwright/test';

test.describe('Core Game Functionality', () => {
  test('Can just see the title', async ({ page }) => {
    await page.goto('/');
    expect(await page.title()).toBe('Game Title');
  });
});
