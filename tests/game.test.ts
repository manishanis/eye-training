import { test, expect } from '@playwright/test';

test.describe('Core Game Functionality', () => {

  test('Can just see the title', async ({ page }) => {
    await page.goto('/');
    expect(await page.title()).toBe('Game Title');
  });

  test.skip('Game Start and Initialization', async ({ page }) => {
    // await page.goto('http://localhost:3001'); // Adjust URL as needed
    await page.goto('http://localhost:3020'); // Adjust URL as needed

    await page.click('button#start-game'); // Assuming there's a start button with this ID

    // Verify initial game state
    const gameState = await page.evaluate(() => window.gameState);
    expect(gameState).toBe('playing');

    // Verify initial score
    const score = await page.evaluate(() => window.score);
    expect(score).toBe(0);

    // Verify first round generation
    const currentTarget = await page.evaluate(() => window.currentTarget);
    expect(currentTarget).not.toBe('');
  });

  test.skip('Option Selection', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('button#start-game');

    // Select an option
    await page.click('.option-item'); // Assuming options have this class

    // Verify score increase or feedback
    const score = await page.evaluate(() => window.score);
    expect(score).toBeGreaterThan(0);

    // Verify new round generation
    const currentTarget = await page.evaluate(() => window.currentTarget);
    expect(currentTarget).not.toBe('');
  });

  test.skip('Pause and Resume', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('button#start-game');
    await page.click('button#pause-game'); // Assuming there's a pause button with this ID

    // Verify game state is paused
    const gameState = await page.evaluate(() => window.gameState);
    expect(gameState).toBe('paused');

    // Resume game
    await page.click('button#resume-game'); // Assuming there's a resume button with this ID

    // Verify game state is playing
    const resumedState = await page.evaluate(() => window.gameState);
    expect(resumedState).toBe('playing');
  });

});
