import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/auth', '/cliente', '/api'],
      },
    ],
    sitemap: 'https://evenser.vercel.app/sitemap.xml',
  }
}
