import { test, expect } from '@playwright/test';

test('sign flow: floating CTA opens dialog, submits, count increments', async ({ page, request }) => {
  const before = await (await request.get('/api/signatures')).json();
  const beforeCount = before.count as number;

  await page.goto('/');

  // Floating sign CTA only reveals once the cover is past — scroll first.
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'instant' as ScrollBehavior }));
  await expect(page.locator('#signOpen')).toHaveClass(/is-on/);
  await page.locator('#signOpen').click();
  await expect(page.locator('#signDialog')).toBeVisible();

  await page.locator('#dialogSignName').fill('UI Tester');
  await page.locator('#dialogSignLinkedin').fill('https://www.linkedin.com/in/ui-tester/');
  await page.locator('#signDialogForm button[type=submit]').click();

  await expect(page.locator('#signDialog')).toBeHidden({ timeout: 5000 });

  const after = await (await request.get('/api/signatures')).json();
  expect(after.count).toBeGreaterThan(beforeCount);
});
