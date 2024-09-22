// import { test, expect } from '@playwright/test';
// import { prismaClient } from '../config/db';
// import fs from 'node:fs';
// import util from 'util';
// import { pipeline } from 'node:stream';
// import path from 'node:path';
// const pump = util.promisify(pipeline);

// test.describe('Test using to check URIs health on the site', async () => {
//   const urls = await prismaClient.url.findMany({
//     select: {
//       url: true,
//     },
//   });
//   test.beforeEach(async ({ page }) => {
//     urls.forEach(({ url }) => {
//       page.goto(url);
//     });
//   });

//   test('main navigation', async ({ page }) => {
//     const URI = new URL(page.url());
    // Assertions use the expect API.
//     expect(urls.includes({ url: page.url() })).toBe(true);

//     const uploaderPath = path.resolve(__dirname, '../public/uploads/test');
//     const fileUrl = path.join(uploaderPath, `test_${URI.hostname}_${Date.now().toString()}.png`);
//     if (urls.includes({ url: page.url() })) {
//       const screenshot = await page.screenshot();
//       try {
//         await pump(screenshot, fs.createWriteStream(fileUrl));
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     return;
//   });

//   test('content verification', async ({page}) => {
//     await page.$eval('title', el => {
//       expect(el.textContent);
//     })
//   })
    
// });
