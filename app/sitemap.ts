import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/server'

const SITE_URL = 'https://evenser.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('memorials')
      .select('slug, updated_at')
      .eq('activo', true)

    const memoriales: MetadataRoute.Sitemap = (data ?? []).map((m) => ({
      url: `${SITE_URL}/memorial/${m.slug}`,
      lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...base, ...memoriales]
  } catch {
    // si la tabla todavía no existe o falla la consulta, devolvemos solo la home
    return base
  }
}
