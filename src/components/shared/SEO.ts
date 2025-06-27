import { createContext, useContext } from 'react'
import type { MetaProps } from './Meta'

const seoMap = new Map<string, MetaProps>()
export interface SeoContextDef {
  getSeo: (id: string) => MetaProps | undefined
  setSeo: (id: string, meta: MetaProps) => void
}

export const defaultSeo: SeoContextDef = {
  getSeo(id) {
    if (seoMap.has(id)) {
      return seoMap.get(id)
    }
  },
  setSeo(id, meta) {
    seoMap.set(id, meta)
  }
}

export const SeoContext = createContext(defaultSeo)

export const useSeo = (id: string, meta: MetaProps) => {
  const ctx = useContext(SeoContext)
  if (!ctx) throw new Error('Use the Seo hook inside a Seo Provider')
  return ctx.setSeo(id, meta)
}
