import { chromium, Browser, Page } from 'playwright';

let page: Page;
let browser: Browser;
let context;

export const LaunchBrowser = async (browserType = 'chromium') => {
  // Launch a browser instance
  browser = await chromium.launch({ headless: false });

  // Create a new browser context and page
  context = await browser.newContext();
  page = await context.newPage();

  // Navigate to a website
  await page.goto('https://example.com');

  // Interact with the page (e.g., take a screenshot)
  await page.screenshot({ path: 'screenshot.png' });

  // Close the browser
  // await browser.close();
};
