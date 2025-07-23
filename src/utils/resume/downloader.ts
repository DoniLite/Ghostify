import path from 'node:path';
import puppeteer, { type Page } from 'puppeteer';
import { z } from 'zod';
import { tokenGenerator } from '../security/jwt.ts';

const ContentDownloaderSchema = z.object({
	url: z.string().optional(),
	content: z.string().optional(),
	path: z
		.object({
			png: z.string(),
			pdf: z.string(),
		})
		.optional(),
});

export type ContentDownloaderOptions = {
	url?: string;
	content?: string;
	path?: {
		png: string;
		pdf: string;
	};
};

export type PageTransformFn<TReturn = void> = (
	page: Page,
) => TReturn | Promise<TReturn>;

type InferDownloadResult<
	TOptions extends ContentDownloaderOptions,
	TFn extends PageTransformFn | undefined,
> = TOptions['path'] extends { png: string; pdf: string }
	? {
			data: {
				imageToken: string;
				pdfToken: string;
			};
		}
	: TFn extends PageTransformFn
		? {
				t: Awaited<ReturnType<TFn>>;
			}
		: {
				page: Page;
				close: () => Promise<void>;
			};

/**
 * @unsafe
 *
 * Content downloading function with generic types
 */
export async function contentDownloader<
	TOptions extends ContentDownloaderOptions,
	TFn extends PageTransformFn | undefined = undefined,
>(opts: TOptions, fn?: TFn): Promise<InferDownloadResult<TOptions, TFn>> {
	ContentDownloaderSchema.parse(opts);

	const STATIC_DIR = path.resolve(process.cwd(), './static/downloads/doc');
	const STATIC_IMG_DIR = path.resolve(process.cwd(), './static/downloads/cv');

	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
	});

	let page: Page | undefined;

	try {
		page = await browser.newPage();

		if (opts.content) {
			await page.setContent(opts.content, { waitUntil: 'networkidle0' });
		} else if (opts.url) {
			await page.goto(opts.url, { waitUntil: 'networkidle0' });
		}

		if (opts.path) {
			const { pdf, png } = opts.path;
			const pdfFilePath = path.join(STATIC_DIR, pdf);
			const pngFilePath = path.join(STATIC_IMG_DIR, png);

			// Génération PDF et PNG
			await Promise.all([
				page.pdf({
					path: pdfFilePath,
					format: 'A4',
					printBackground: true,
					margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
				}),
				page.screenshot({
					path: pngFilePath,
					fullPage: true,
				}),
			]);

			const [imageToken, pdfToken] = await Promise.all([
				tokenGenerator({ path: `download/${png}` }),
				tokenGenerator({ path: `download/${pdf}` }),
			]);

			await page.close();
			await browser.close();

			return {
				data: { imageToken, pdfToken },
			} as InferDownloadResult<TOptions, TFn>;
		}

		if (fn) {
			const result = await fn(page);
			await page.close();
			await browser.close();
			return {
				t: result,
			} as InferDownloadResult<TOptions, TFn>;
		}

		return {
			page,
			close: async () => {
				if (page) {
					await page.close();
				}
				await browser.close();
			},
		} as InferDownloadResult<TOptions, TFn>;
	} catch (error) {
		if (page && !page.isClosed()) {
			await page.close();
		}
		await browser.close();
		throw error;
	}
}
