const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  const targets = [
    ['01-hero.png', '#home'],
    ['02-roles.png', '#roles'],
    ['03-process.png', '#process'],
    ['04-cases.png', '#cases'],
    ['05-assurance.png', '#assurance'],
    ['06-footer.png', '#contact'],
  ];
  for (const [file, selector] of targets) {
    const element = page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(950);
    await element.screenshot({ path: path.join('screenshots', file) });
  }
  await browser.close();
})();
