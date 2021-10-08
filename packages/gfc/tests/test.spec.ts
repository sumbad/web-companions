import { test } from '@playwright/test';
import v8toIstanbul from 'v8-to-istanbul';
import fs from 'fs';
import path from 'path';

test('test', async ({ page, baseURL }) => {
  // baseURL is taken directly from your web server,
  // e.g. http://localhost:3000
  // await page.goto(baseURL + '/bar');
  // Alternatively, just use relative path, because baseURL is already
  // set for the default context and page.
  // For example, this will result in http://localhost:3000/foo

  await page.coverage.startJSCoverage();

  await page.goto('/');

  console.log(page.url());

  let data = {};

  const coverage = await page.coverage.stopJSCoverage();
  for (const entry of coverage) {
    const converter = v8toIstanbul('', 0, { source: entry.source });
    await converter.load();
    converter.applyCoverage(entry.functions);

    // https://istanbul.js.org/docs/advanced/alternative-reporters/#json
    data = {
      ...data,
      ...converter.toIstanbul(),
    };
  }

  for (const key in data) {
    const item = data[key];

    if (item['path'] === '') {
      delete data[key];
      continue;
    }

    if (typeof item['path'] === 'string') {
      item['path'] = `.${item['path'].split('?')[0]}`;
    }
  }

  fs.writeFileSync(path.join(__dirname, '../.nyc_output/coverage-final.json'), JSON.stringify(data));
});
