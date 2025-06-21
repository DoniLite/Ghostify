import { Resvg } from 'npm:@resvg/resvg-js'
import satori from 'npm:satori'
import React from 'react'
import { DocumentOGData, OGImageParams } from '../../@types/og.ts'
import { loadFonts } from '../fonts.ts'
import { DocumentTemplate, PageTemplate, ResumeTemplate } from '../templates/openGraph.tsx'

export class OGImageGenerator {
  // deno-lint-ignore no-explicit-any
  private fonts: any[] = []
  private fontsLoaded = false

  constructor() {
    this.initializeFonts()
  }

  private async initializeFonts() {
    try {
      this.fonts = await loadFonts()
      this.fontsLoaded = true
    } catch (error) {
      console.warn('Failed to load fonts:', error)
      // Continuer sans polices personnalisées
    }
  }

  private getTemplate(params: OGImageParams, data?: DocumentOGData) {
    switch (params.type) {
      case 'page':
        return React.createElement(PageTemplate, { params, data })

      case 'document':
        return React.createElement(DocumentTemplate, { params, data })

      case 'resume':
        return React.createElement(ResumeTemplate, { params, data })

      default:
        return React.createElement(PageTemplate, { params, data })
    }
  }

  async generateImage(params: OGImageParams, data?: DocumentOGData): Promise<Uint8Array> {
    // Attendre que les polices soient chargées si ce n'est pas déjà fait
    if (!this.fontsLoaded) {
      await this.initializeFonts()
    }

    const template = this.getTemplate(params, data)

    try {
      // Générer le SVG avec Satori
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
                  style: 'normal'
                }
              ]
      })

      // Convertir le SVG en PNG avec resvg
      const resvgInstance = new Resvg(svg)
      const pngData = resvgInstance.render()

      return pngData.asPng()
    } catch (error) {
      console.error('Error generating OG image:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to generate OG image: ${error.message}`)
      }
      throw new Error(`Failed to generate OG image: ${error}`)
    }
  }

  // Méthode utilitaire pour générer une image et la retourner en base64
  async generateImageBase64(params: OGImageParams, data?: DocumentOGData): Promise<string> {
    const imageBuffer = await this.generateImage(params, data)
    return `data:image/png;base64,${btoa(String.fromCharCode(...imageBuffer))}`
  }

  // Cache simple en mémoire (à améliorer avec Redis/KV en production)
  private cache = new Map<string, { data: Uint8Array; timestamp: number }>()
  private readonly CACHE_TTL = 3600000 // 1 heure

  private getCacheKey(params: OGImageParams, data?: DocumentOGData): string {
    return `og_${params.type}_${JSON.stringify(params)}_${JSON.stringify(data)}`
  }

  async generateImageWithCache(params: OGImageParams, data?: DocumentOGData): Promise<Uint8Array> {
    const cacheKey = this.getCacheKey(params, data)
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }

    const imageData = await this.generateImage(params, data)

    // Stocker en cache
    this.cache.set(cacheKey, {
      data: imageData,
      timestamp: Date.now()
    })

    return imageData
  }

  cleanCache() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.cache.delete(key)
      }
    }
  }
}

// Instance singleton
export const ogGenerator = new OGImageGenerator()

// Cleaning the cache every hour
setInterval(() => {
  ogGenerator.cleanCache()
}, 3600000)

// deno-lint-ignore no-explicit-any
export function validateOGParams(params: any): params is OGImageParams {
  return (
    typeof params === 'object' &&
    typeof params.type === 'string' &&
    ['page', 'document', 'resume'].includes(params.type) &&
    typeof params.title === 'string' &&
    params.title.length > 0 &&
    params.title.length <= 100
  )
}

// Personalized error type
export class OGImageError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message)
    this.name = 'OGImageError'
  }
}

export class ValidationError extends OGImageError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
  }
}

export class GenerationError extends OGImageError {
  constructor(message: string) {
    super(message, 'GENERATION_ERROR')
  }
}
