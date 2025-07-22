import { Resvg } from '@resvg/resvg-js';
import React from 'react';
import satori from 'satori';
import type { DocumentOGData, OGImageParams } from '../../@types/og';
import { loadFonts } from '../fonts';
import {
	DocumentTemplate,
	PageTemplate,
	ResumeTemplate,
} from '../templates/openGraph';

export class OGImageGenerator {
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic font loading
	private fonts: any[] = [];
	private fontsLoaded = false;

	constructor() {
		this.initializeFonts();
	}

	
	public get getCache(): Map<string, { data: Uint8Array; timestamp: number }> {
		return this.cache;
	}
	

	private async initializeFonts() {
		try {
			this.fonts = await loadFonts();
			this.fontsLoaded = true;
		} catch (error) {
			console.warn('Failed to load fonts:', error);
			// Continuer sans polices personnalisées
		}
	}

	private getTemplate(params: OGImageParams, data?: DocumentOGData) {
		switch (params.type) {
			case 'page':
				return React.createElement(PageTemplate, { params, data });

			case 'document':
				return React.createElement(DocumentTemplate, { params, data });

			case 'resume':
				return React.createElement(ResumeTemplate, { params, data });

			default:
				return React.createElement(PageTemplate, { params, data });
		}
	}

	async generateImage(
		params: OGImageParams,
		data?: DocumentOGData,
	): Promise<Uint8Array> {
		if (!this.fontsLoaded) {
			await this.initializeFonts();
		}

		const template = this.getTemplate(params, data);

		try {
			const svg = await satori(template, {
				width: 1200,
				height: 630,
				fonts:
					this.fonts.length > 0
						? this.fonts
						: [
								// Fallback system fonts
								{
									name: 'Arial',
									data: new ArrayBuffer(0),
									weight: 400,
									style: 'normal',
								},
							],
			});

			const resvgInstance = new Resvg(svg);
			const pngData = resvgInstance.render();

			return pngData.asPng();
		} catch (error) {
			console.error('Error generating OG image:', error);
			if (error instanceof Error) {
				throw new Error(`Failed to generate OG image: ${error.message}`);
			}
			throw new Error(`Failed to generate OG image: ${error}`);
		}
	}

	async generateImageBase64(
		params: OGImageParams,
		data?: DocumentOGData,
	): Promise<string> {
		const imageBuffer = await this.generateImage(params, data);
		return `data:image/png;base64,${btoa(String.fromCharCode(...imageBuffer))}`;
	}

	private cache = new Map<string, { data: Uint8Array; timestamp: number }>();
	private readonly CACHE_TTL = 3600000;

	private getCacheKey(params: OGImageParams, data?: DocumentOGData): string {
		return `og_${params.type}_${JSON.stringify(params)}_${JSON.stringify(data)}`;
	}

	async generateImageWithCache(
		params: OGImageParams,
		data?: DocumentOGData,
	): Promise<Uint8Array> {
		const cacheKey = this.getCacheKey(params, data);
		const cached = this.cache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
			return cached.data;
		}

		const imageData = await this.generateImage(params, data);

		// Stocker en cache
		this.cache.set(cacheKey, {
			data: imageData,
			timestamp: Date.now(),
		});

		return imageData;
	}

	cleanCache() {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > this.CACHE_TTL) {
				this.cache.delete(key);
			}
		}
	}
}

// Instance singleton
export const ogGenerator = new OGImageGenerator();

// Cleaning the cache every hour
setInterval(() => {
	ogGenerator.cleanCache();
}, 3600000);

// biome-ignore lint/suspicious/noExplicitAny: the params is validated
export function validateOGParams(params: any): params is OGImageParams {
	return (
		typeof params === 'object' &&
		typeof params.type === 'string' &&
		['page', 'document', 'resume'].includes(params.type) &&
		typeof params.title === 'string' &&
		params.title.length > 0 &&
		params.title.length <= 100
	);
}

// Personalized error type
export class OGImageError extends Error {
	constructor(
		message: string,
		public code: string,
	) {
		super(message);
		this.name = 'OGImageError';
	}
}

export class ValidationError extends OGImageError {
	constructor(message: string) {
		super(message, 'VALIDATION_ERROR');
	}
}

export class GenerationError extends OGImageError {
	constructor(message: string) {
		super(message, 'GENERATION_ERROR');
	}
}
