import { expect, Page, test } from '@playwright/test';
import v8toIstanbul from 'v8-to-istanbul';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

test.describe('Test demo components', () => {
  let page: Page;
  const MAIN_COMPONENT_TAG = 'demo-gfc';
  const UPDATE_PROPS_COMPONENT_TAG = 'update-props-with-next-element';

  test.beforeAll(async ({ browser, browserName }) => {
    page = await browser.newPage();

    if (browserName === 'chromium') {
      await page.coverage.startJSCoverage();
    }

    await page.goto('/');
    console.log(browserName, page.url());
  });

  test.afterAll(async ({ browserName }) => {
    if (browserName === 'chromium') {
      const notCoveragePaths = /^$|(www)|(node_modules)/gi;
      let data = {};

      const coverage = await page.coverage.stopJSCoverage();

      for (const entry of coverage) {
        if (entry.source != null) {
          const converter = v8toIstanbul('', 0, { source: entry.source });
          await converter.load();
          converter.applyCoverage(entry.functions);

          // https://istanbul.js.org/docs/advanced/alternative-reporters/#json
          data = {
            ...data,
            ...converter.toIstanbul(),
          };
        }
      }

      for (const key in data) {
        const item = data[key];

        if (notCoveragePaths.test(item['path'])) {
          delete data[key];
          continue;
        }

        if (typeof item['path'] === 'string') {
          item['path'] = `${item['path'].split('?')[0]}`.replace('@web-companions/gfc/', '');
        }
      }

      const saveDir = join(__dirname, '../.nyc_output');

      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir);
      }

      fs.writeFileSync(join(saveDir, 'coverage-final.json'), JSON.stringify(data));
    }
  });

  test(`${MAIN_COMPONENT_TAG} should be rendered`, async () => {
    const elementHandle = await page.$(`${MAIN_COMPONENT_TAG}`);

    expect(elementHandle!.asElement()).toBeDefined();
  });

  test(`${UPDATE_PROPS_COMPONENT_TAG} should work`, async () => {
    const elementHandle = await page.$(`${UPDATE_PROPS_COMPONENT_TAG}`);

    expect(elementHandle!.asElement()).toBeDefined();

    await (await elementHandle!.$('id=test1'))!.click();
    expect(await (await elementHandle!.$('span'))!.asElement().textContent()).toBe('Value p1 - test1');

    await (await elementHandle!.$('id=test2'))!.click();
    expect(await (await elementHandle!.$('span'))!.asElement().textContent()).toBe('Value p1 - test2');

    await (await elementHandle!.$('id=test3'))!.click();
    expect(await (await elementHandle!.$('span'))!.asElement().textContent()).toBe('Value p1 - test3');

    await (await elementHandle!.$('id=test4'))!.click();
    expect(await (await elementHandle!.$('span'))!.asElement().textContent()).toBe('Value p1 - test3');
  });
});
