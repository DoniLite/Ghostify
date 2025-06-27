import path from 'path';
import puppeteer, { type Page } from 'puppeteer';
import { z } from 'zod';
import { tokenGenerator } from '../security/jwt.ts';

// Schéma de validation des options
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

// Type générique pour les options de téléchargement
export type ContentDownloaderOptions = {
	url?: string;
	content?: string;
	path?: {
		png: string;
		pdf: string;
	};
};

// Type générique pour la fonction de transformation
export type PageTransformFn<TReturn = void> = (
	page: Page,
) => TReturn | Promise<TReturn>;

// Type utilitaire pour inférer le type de retour conditionnel
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
 * Fonction de téléchargement de contenu hautement générique
 */
export async function contentDownloader<
	TOptions extends ContentDownloaderOptions,
	TFn extends PageTransformFn | undefined = undefined,
>(opts: TOptions, fn?: TFn): Promise<InferDownloadResult<TOptions, TFn>> {
	// Validation des options
	ContentDownloaderSchema.parse(opts);

	// Chemins statiques
	const STATIC_DIR = path.resolve(Deno.cwd(), './static/downloads/doc');
	const STATIC_IMG_DIR = path.resolve(Deno.cwd(), './static/downloads/cv');

	// Lancement du navigateur
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
	});

	let page: Page | undefined;

	try {
		page = await browser.newPage();

		// Chargement du contenu
		if (opts.content) {
			await page.setContent(opts.content, { waitUntil: 'networkidle0' });
		} else if (opts.url) {
			await page.goto(opts.url, { waitUntil: 'networkidle0' });
		}

		// Gestion des chemins de fichiers
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

			// Génération des tokens
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

		// Exécution de la fonction personnalisée
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
