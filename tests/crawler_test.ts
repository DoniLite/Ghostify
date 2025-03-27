import { assertEquals } from 'jsr:@std/assert/equals';
import { contentDownloader } from '../src/utils.ts';


Deno.test('crawler test', async (t) => {
    await t.step('should return the browser Page', async () => {
        const p = await contentDownloader({
            content: `<h1 id="hello">Hello world !</h1>`
        });
        const { page, close } = p;
        const el = (await page.$('#hello'))?.toString();
        await page.close();
        await close();
        assertEquals(typeof el, `string`);
    });
})