import { DocumentOGData, OGImageParams } from '../@types/og.ts'
import { factory } from '../factory.ts'
import {
  GenerationError,
  ogGenerator,
  validateOGParams,
  ValidationError
} from '../utils/og/generator.ts'

const og = factory.createApp()

og.get('/', async (c) => {
  try {
    const url = new URL(c.req.url)
    const searchParams = url.searchParams

    const params: Partial<OGImageParams> = {
      type: (searchParams.get('type') as 'page' | 'document' | 'resume') || 'page',
      title: searchParams.get('title') || 'Ghostify',
      description: searchParams.get('description') || undefined,
      author: searchParams.get('author') || undefined,
      template: searchParams.get('template') || undefined,
      userId: searchParams.get('userId') || undefined,
      documentId: searchParams.get('documentId') || undefined,
      theme: (searchParams.get('theme') as 'light' | 'dark') || 'dark',
      brandColor: searchParams.get('brandColor') || '#ff6b35'
    }

    // Validation des paramètres
    if (!validateOGParams(params)) {
      throw new ValidationError('Invalidated params for the OG image generator')
    }

    let documentData: DocumentOGData | undefined
    if (params.documentId && (params.type === 'document' || params.type === 'resume')) {
      documentData = await getDocumentData(params.documentId, params.userId)
    }

    const imageBuffer = await ogGenerator.generateImageWithCache(params, documentData)

    // Image headers
    return c.newResponse(imageBuffer, 200, {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'CDN-Cache-Control': 'public, max-age=31536000',
      'Vercel-CDN-Cache-Control': 'public, max-age=31536000'
    })
  } catch (error) {
    console.error('OG Image generation error:', error)

    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400)
    }

    if (error instanceof GenerationError) {
      return c.json({ error: 'Error during the image generation' }, 500)
    }

    return c.json({ error: 'Internal server error' }, 500)
  }
})

og.get('/preview', async (c) => {
  try {
    const url = new URL(c.req.url)
    const searchParams = url.searchParams

    const params: Partial<OGImageParams> = {
      type: (searchParams.get('type') as 'page' | 'document' | 'resume') || 'page',
      title: searchParams.get('title') || 'Aperçu Ghostify',
      description: searchParams.get('description') || 'Your Open Graph image preview',
      author: searchParams.get('author') || 'Ghostify user',
      template: searchParams.get('template') || 'default',
      theme: (searchParams.get('theme') as 'light' | 'dark') || 'dark'
    }

    if (!validateOGParams(params)) {
      throw new ValidationError('Invalid preview params')
    }

    // Mock data for the preview
    const mockData: DocumentOGData | undefined =
      params.type !== 'page'
        ? {
            title: params.title,
            author: params.author || 'John Doe',
            type: params.type === 'resume' ? 'resume' : 'document',
            createdAt: new Date().toISOString(),
            template: params.template || 'modern'
          }
        : undefined

    const imageBuffer = await ogGenerator.generateImage(params, mockData)

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Preview generation error:', error)
    return c.json({ error: 'Error during the preview generation' }, 500)
  }
})

// Route pour les pages statiques du site
og.get('/page/:pageType', async (c) => {
  const pageType = c.req.param('pageType')

  const pageConfigs: Record<string, OGImageParams> = {
    home: {
      type: 'page',
      title: 'Boost your productivity',
      description: 'Plateforme de création et partage de documents et CV'
    },
    pricing: {
      type: 'page',
      title: 'Pricing',
      description: 'Choisissez le plan qui vous convient'
    },
    features: {
      type: 'page',
      title: 'Features',
      description: 'Découvrez toutes les fonctionnalités de Ghostify'
    },
    templates: {
      type: 'page',
      title: 'Templates',
      description: 'Modèles professionnels pour vos documents et CV'
    }
  }

  const config = pageConfigs[pageType]
  if (!config) {
    return c.json({ error: 'Not found Page' }, 404)
  }

  try {
    const imageBuffer = await ogGenerator.generateImageWithCache(config)

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400' // 24h pour les pages statiques
      }
    })
  } catch (error) {
    console.error('Static page OG generation error:', error)
    return c.json({ error: 'Erreur lors de la génération' }, 500)
  }
})

// Fonction utilitaire pour récupérer les données d'un document
// async function getDocumentData(
function getDocumentData(
  _documentId: string,
  _userId?: string
  // ): Promise<DocumentOGData | undefined> {
): DocumentOGData | undefined {
  try {
    // Ici tu intègres ta logique de récupération depuis ta base de données
    // Exemple avec une API ou une base de données

    // const response = await fetch(`/api/documents/${documentId}?userId=${userId}`);
    // const document = await response.json();

    // Pour l'exemple, retour de données factices
    return {
      title: 'Mon Document Professionnel',
      author: 'John Doe',
      type: 'document',
      createdAt: new Date().toISOString(),
      template: 'modern'
    }
  } catch (error) {
    console.error('Error fetching document data:', error)
    return undefined
  }
}

// Route de santé/debug
og.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'og-image-generator',
    timestamp: new Date().toISOString(),
    cache_size: ogGenerator['cache']?.size || 0
  })
})

export default og
