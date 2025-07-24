// Bun runtime utilities

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type {
	InputFormats,
	OutputFormats,
} from '../../utils/const/pandoc_enums.ts'; // ADJUST THIS PATH TO WHERE YOUR ENUMS ARE SAVED!

/**
 * Represents a Pandoc conversion error.
 */
export class PandocConversionError extends Error {
	override name = 'PandocConversionError';
	constructor(
		message: string,
		public stdout?: string,
		public stderr?: string,
		public exitCode?: number,
	) {
		super(message);
		Object.setPrototypeOf(this, PandocConversionError.prototype);
	}
}

/**
 * Interface for configuration options for the PandocConverter.
 */
export interface PandocConverterOptions {
	/**
	 * The path to the Pandoc executable. Defaults to 'pandoc' (assumes it's in your PATH).
	 */
	pandocPath?: string;
	/**
	 * Optional directory for temporary files or output if not specified.
	 */
	tempDir?: string;
	/**
	 * Custom CSS file path for HTML output styling
	 */
	cssPath?: string;
	/**
	 * Custom LaTeX template path for PDF output
	 */
	latexTemplate?: string;
	/**
	 * Custom reference document for Word output (.docx)
	 */
	referenceDoc?: string;
}

/**
 * Enhanced conversion options with better format handling
 */
export interface ConvertOptions {
	/**
	 * The input content as a string.
	 */
	content: string;
	/**
	 * The format of the input content.
	 */
	from: InputFormats;
	/**
	 * The desired output format.
	 */
	to: OutputFormats;
	/**
	 * Optional path to save the output file. If not provided, the output will be returned as a string.
	 */
	outputFilePath?: string;
	/**
	 * Additional command-line arguments to pass directly to Pandoc.
	 */
	additionalArgs?: string[];
	/**
	 * If true, Pandoc's stdout and stderr will be logged to the console.
	 */
	verbose?: boolean;
	/**
	 * Preserve formatting and styles (enables advanced conversion options)
	 */
	preserveFormatting?: boolean;
	/**
	 * Enable table of contents
	 */
	tableOfContents?: boolean;
	/**
	 * Number headings
	 */
	numberSections?: boolean;
	/**
	 * DPI for image conversion (useful for PDF output)
	 */
	dpi?: number;
	/**
	 * Custom metadata for the document
	 */
	metadata?: Record<string, string>;
}

/**
 * A class for converting documents using the Pandoc CLI with enhanced formatting support.
 */
export class PandocConverter {
	private pandocPath: string;
	private tempDir: string;
	private cssPath?: string;
	private latexTemplate?: string;
	private referenceDoc?: string;

	constructor(options?: PandocConverterOptions) {
		this.pandocPath = options?.pandocPath || 'pandoc';
		this.tempDir = options?.tempDir || '';
		this.cssPath = options?.cssPath;
		this.latexTemplate = options?.latexTemplate;
		this.referenceDoc = options?.referenceDoc;
	}

	/**
	 * Initialize temporary directory if not provided
	 */
	private async initTempDir(): Promise<string> {
		if (!this.tempDir) {
			this.tempDir = await mkdtemp(join(tmpdir(), 'pandoc-converter-'));
		}
		return this.tempDir;
	}

	/**
	 * Build enhanced Pandoc arguments for better format preservation
	 */
	private buildEnhancedArgs(options: ConvertOptions): string[] {
		const args: string[] = [];
		const {
			from,
			to,
			preserveFormatting,
			tableOfContents,
			numberSections,
			dpi,
			metadata,
		} = options;

		// Basic format arguments with extensions for better compatibility
		const fromFormat = this.getEnhancedFormat(from, 'input');
		const toFormat = this.getEnhancedFormat(to, 'output');

		args.push(`--from=${fromFormat}`);
		args.push(`--to=${toFormat}`);

		// Enhanced formatting options
		if (preserveFormatting) {
			// Preserve more formatting elements
			args.push('--wrap=preserve');
			args.push('--preserve-tabs');

			// Better handling of different elements
			if (to === 'html' || to === 'html5') {
				args.push('--mathml');
				args.push('--embed-resources');
				args.push('--standalone');
			}

			if (to === 'docx') {
				args.push('--standalone');
				if (this.referenceDoc) {
					args.push(`--reference-doc=${this.referenceDoc}`);
				}
			}

			if (to === 'pdf' || to === 'latex') {
				args.push('--standalone');
				if (this.latexTemplate) {
					args.push(`--template=${this.latexTemplate}`);
				}
			}
		}

		// Table of contents
		if (tableOfContents) {
			args.push('--toc');
			args.push('--toc-depth=3');
		}

		// Number sections
		if (numberSections) {
			args.push('--number-sections');
		}

		// DPI for images
		if (dpi) {
			args.push(`--dpi=${dpi}`);
		}

		// CSS for HTML output
		if ((to === 'html' || to === 'html5') && this.cssPath) {
			args.push(`--css=${this.cssPath}`);
		}

		// Metadata
		if (metadata) {
			for (const [key, value] of Object.entries(metadata)) {
				args.push(`--metadata=${key}:${value}`);
			}
		}

		// Output file
		if (options.outputFilePath) {
			args.push(`--output=${options.outputFilePath}`);
		}

		return args;
	}

	/**
	 * Get enhanced format string with useful extensions
	 */
	private getEnhancedFormat(format: string, type: 'input' | 'output'): string {
		const formatExtensions: Record<string, string> = {
			// Markdown with useful extensions
			markdown:
				'markdown+backtick_code_blocks+fenced_code_attributes+footnotes+inline_notes+pipe_tables+raw_html+tex_math_dollars+yaml_metadata_block+auto_identifiers+implicit_header_references',
			markdown_strict: 'markdown_strict+backtick_code_blocks+pipe_tables',
			gfm: 'gfm+footnotes+tex_math_dollars',

			// HTML with better parsing
			html: 'html+raw_tex+tex_math_dollars',
			html5: 'html5+raw_tex+tex_math_dollars',

			// Word document improvements
			docx: type === 'input' ? 'docx+styles' : 'docx',

			// LaTeX improvements
			latex: 'latex+raw_html+tex_math_dollars',

			// RTF improvements
			rtf: 'rtf',

			// ODT improvements
			odt: 'odt',
		};

		return formatExtensions[format] || format;
	}

	/**
	 * Converts document content from one format to another using Pandoc with enhanced formatting.
	 */
	public async convert(options: ConvertOptions): Promise<string> {
		await this.initTempDir();

		const { content, additionalArgs = [], verbose = false } = options;

		// Build enhanced arguments
		const args = this.buildEnhancedArgs(options);

		// Add any additional arguments provided by the user
		args.push(...additionalArgs);

		if (verbose) {
			console.log(
				`Executing Pandoc command: ${this.pandocPath} ${args.join(' ')}`,
			);
		}

		try {
			// Use Bun's spawn for process execution
			const process = Bun.spawn([this.pandocPath, ...args], {
				stdin: 'pipe',
				stdout: options.outputFilePath ? 'inherit' : 'pipe',
				stderr: 'pipe',
			});

			// Write content to stdin
			process.stdin.write(new TextEncoder().encode(content));

			// Wait for process completion
			const exitCode = await process.exited;

			// Read stderr for error handling
			const stderrText = await new Response(process.stderr).text();

			if (verbose && stderrText) {
				console.error('Pandoc STDERR:\n', stderrText);
			}

			if (exitCode !== 0) {
				const stdoutText = options.outputFilePath
					? ''
					: await new Response(process.stdout).text();
				throw new PandocConversionError(
					`Pandoc conversion failed with exit code ${exitCode}.`,
					stdoutText,
					stderrText,
					exitCode,
				);
			}

			// Return result
			if (options.outputFilePath) {
				return options.outputFilePath;
			} else {
				return await new Response(process.stdout).text();
			}
		} catch (error) {
			if (error instanceof PandocConversionError) {
				throw error;
			}
			throw new PandocConversionError(
				`Failed to execute Pandoc: ${(error as Error).message || 'Unknown error'}`,
				undefined,
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	/**
	 * Helper to create a temporary file for writing content.
	 */
	public async createTempFile(
		content: string,
		filename: string,
	): Promise<string> {
		await this.initTempDir();
		const filePath = join(this.tempDir, filename);
		await writeFile(filePath, content, 'utf8');
		return filePath;
	}

	/**
	 * Create a default CSS file for better HTML styling
	 */
	public async createDefaultCSS(): Promise<string> {
		const css = `
/* Enhanced document styling for better compatibility */
body {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	line-height: 1.6;
	color: #333;
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	background-color: #fff;
}

h1, h2, h3, h4, h5, h6 {
	color: #2c3e50;
	margin-top: 1.5em;
	margin-bottom: 0.5em;
	font-weight: 600;
}

h1 { font-size: 2.25em; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
h2 { font-size: 1.75em; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px; }
h3 { font-size: 1.5em; }
h4 { font-size: 1.25em; }

p { margin-bottom: 1em; }

/* Tables */
table {
	border-collapse: collapse;
	width: 100%;
	margin: 1em 0;
}

th, td {
	border: 1px solid #ddd;
	padding: 12px;
	text-align: left;
}

th {
	background-color: #f8f9fa;
	font-weight: 600;
}

tr:nth-child(even) {
	background-color: #f8f9fa;
}

/* Code blocks */
pre {
	background-color: #f8f9fa;
	border: 1px solid #e9ecef;
	border-radius: 4px;
	padding: 1em;
	overflow-x: auto;
	font-size: 0.9em;
}

code {
	background-color: #f8f9fa;
	padding: 2px 4px;
	border-radius: 3px;
	font-size: 0.9em;
}

/* Lists */
ul, ol {
	margin-bottom: 1em;
	padding-left: 2em;
}

li {
	margin-bottom: 0.5em;
}

/* Blockquotes */
blockquote {
	border-left: 4px solid #3498db;
	margin: 1em 0;
	padding-left: 1em;
	color: #555;
	font-style: italic;
}

/* Images */
img {
	max-width: 100%;
	height: auto;
	display: block;
	margin: 1em auto;
}

/* Links */
a {
	color: #3498db;
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

/* Print styles */
@media print {
	body {
		max-width: none;
		padding: 0;
	}
	
	h1, h2, h3, h4, h5, h6 {
		page-break-after: avoid;
	}
	
	pre, blockquote, table {
		page-break-inside: avoid;
	}
}
`;

		const cssPath = await this.createTempFile(css, 'default-styles.css');
		this.cssPath = cssPath;
		return cssPath;
	}

	/**
	 * Cleans up the temporary directory created by the converter.
	 */
	public async cleanupTempDir(): Promise<void> {
		if (this.tempDir) {
			try {
				await rm(this.tempDir, { recursive: true, force: true });
			} catch (error) {
				console.warn(
					`Failed to remove temporary directory ${this.tempDir}: ${error}`,
				);
			}
		}
	}

	/**
	 * Check if required dependencies are installed
	 */
	public async checkDependencies(): Promise<{
		pandoc: boolean;
		latex: boolean;
		imagemagick: boolean;
		libreoffice: boolean;
		wkhtmltopdf: boolean;
		missing: string[];
		recommendations: string[];
	}> {
		const dependencies = {
			pandoc: false,
			latex: false,
			imagemagick: false,
			libreoffice: false,
			wkhtmltopdf: false,
			missing: [] as string[],
			recommendations: [] as string[],
		};

		// Check Pandoc
		try {
			const pandocCheck = Bun.spawn([this.pandocPath, '--version'], {
				stdout: 'pipe',
				stderr: 'pipe',
			});
			const exitCode = await pandocCheck.exited;
			dependencies.pandoc = exitCode === 0;
		} catch {
			dependencies.pandoc = false;
		}

		// Check LaTeX (pdflatex)
		try {
			const latexCheck = Bun.spawn(['pdflatex', '--version'], {
				stdout: 'pipe',
				stderr: 'pipe',
			});
			const exitCode = await latexCheck.exited;
			dependencies.latex = exitCode === 0;
		} catch {
			dependencies.latex = false;
		}

		// Check ImageMagick
		try {
			const imgCheck = Bun.spawn(['convert', '-version'], {
				stdout: 'pipe',
				stderr: 'pipe',
			});
			const exitCode = await imgCheck.exited;
			dependencies.imagemagick = exitCode === 0;
		} catch {
			dependencies.imagemagick = false;
		}

		// Check LibreOffice
		try {
			const loCheck = Bun.spawn(['libreoffice', '--version'], {
				stdout: 'pipe',
				stderr: 'pipe',
			});
			const exitCode = await loCheck.exited;
			dependencies.libreoffice = exitCode === 0;
		} catch {
			// Try alternative command
			try {
				const loCheck2 = Bun.spawn(['soffice', '--version'], {
					stdout: 'pipe',
					stderr: 'pipe',
				});
				const exitCode2 = await loCheck2.exited;
				dependencies.libreoffice = exitCode2 === 0;
			} catch {
				dependencies.libreoffice = false;
			}
		}

		// Check wkhtmltopdf
		try {
			const wkCheck = Bun.spawn(['wkhtmltopdf', '--version'], {
				stdout: 'pipe',
				stderr: 'pipe',
			});
			const exitCode = await wkCheck.exited;
			dependencies.wkhtmltopdf = exitCode === 0;
		} catch {
			dependencies.wkhtmltopdf = false;
		}

		// Build missing and recommendations
		if (!dependencies.pandoc) {
			dependencies.missing.push('pandoc');
		}

		if (!dependencies.latex) {
			dependencies.missing.push('texlive/mactex/miktex');
			dependencies.recommendations.push(
				'Install LaTeX for PDF conversion support',
			);
		}

		if (!dependencies.imagemagick) {
			dependencies.missing.push('imagemagick');
			dependencies.recommendations.push(
				'Install ImageMagick for better image handling',
			);
		}

		if (!dependencies.libreoffice) {
			dependencies.missing.push('libreoffice');
			dependencies.recommendations.push(
				'Install LibreOffice for ODT/DOC support',
			);
		}

		if (!dependencies.wkhtmltopdf) {
			dependencies.missing.push('wkhtmltopdf');
			dependencies.recommendations.push(
				'Install wkhtmltopdf for HTML to PDF conversion',
			);
		}

		return dependencies;
	}

	/**
	 * Utility method for batch conversion with consistent formatting
	 */
	public async convertBatch(
		documents: Array<{
			content: string;
			filename: string;
			from: InputFormats;
			to: OutputFormats;
		}>,
		options?: Partial<ConvertOptions>,
	): Promise<
		Array<{
			filename: string;
			content: string;
			success: boolean;
			error?: string;
		}>
	> {
		const results = [];

		for (const doc of documents) {
			try {
				const content = await this.convert({
					content: doc.content,
					from: doc.from,
					to: doc.to,
					preserveFormatting: true,
					...options,
				});

				results.push({
					filename: doc.filename,
					content,
					success: true,
				});
			} catch (error) {
				results.push({
					filename: doc.filename,
					content: '',
					success: false,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}

		return results;
	}
}

// Exemple d'utilisation avec vérification des dépendances
export async function example() {
	const converter = new PandocConverter();

	// Vérifier les dépendances installées
	const deps = await converter.checkDependencies();
	console.log('Dependencies status:', deps);

	if (deps.missing.length > 0) {
		console.warn('Missing dependencies:', deps.missing.join(', '));
		console.log('Recommendations:', deps.recommendations.join('\n'));
	}

	// Créer un CSS par défaut pour un meilleur rendu
	await converter.createDefaultCSS();

	try {
		// Conversion avec préservation du formatage
		const result = await converter.convert({
			content: `# Mon Document\n\nCeci est un **exemple** avec du *style*.\n\n| Colonne 1 | Colonne 2 |\n|-----------|----------|\n| Valeur 1  | Valeur 2  |`,
			from: 'markdown' as InputFormats,
			to: 'html' as OutputFormats,
			preserveFormatting: true,
			tableOfContents: true,
			numberSections: true,
			metadata: {
				title: 'Mon Document',
				author: 'Votre Nom',
			},
		});

		console.log(result);
	} finally {
		await converter.cleanupTempDir();
	}
}
