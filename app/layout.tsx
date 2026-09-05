import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = 'https://evenser.vercel.app'
const TITLE =
  'Evenser — Servicio Fúnebre en Colonia Elisa, Chaco | Afiliación Familiar'
const DESCRIPTION =
  'Servicio fúnebre integral en Colonia Elisa y toda la región (La Escondida, Makallé, Sáenz Peña, Las Garcitas y más). Afiliación familiar desde $20.000/mes: sala y calle, traslados, cremaciones, trámites de registro civil y cafetería. Atención las 24 horas.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Evenser',
  },
  description: DESCRIPTION,
  keywords: [
    'servicio funerario Colonia Elisa',
    'cochería Chaco',
    'afiliación funeraria',
    'servicios fúnebres Chaco',
    'cremaciones Colonia Elisa',
    'traslados fúnebres',
    'Evenser',
  ],
  authors: [{ name: 'Evenser — Eventos y Servicios Sociales' }],
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: 'Evenser',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Evenser — Servicio fúnebre en Colonia Elisa, Chaco',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Evenser' },
  icons: { apple: '/icons/icon-192.png' },
}

export const viewport: Viewport = {
  themeColor: '#101c28',
  width: 'device-width',
  initialScale: 1,
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FuneralHome',
  name: 'Evenser — Eventos y Servicios Sociales',
  image: `${SITE_URL}/og-image.png`,
  url: SITE_URL,
  telephone: '+543734409813',
  email: 'balgim73@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Fortunato Pértile 637',
    addressLocality: 'Colonia Elisa',
    addressRegion: 'Chaco',
    addressCountry: 'AR',
  },
  areaServed: [
    'Colonia Elisa',
    'La Escondida',
    'Tirol',
    'La Verde',
    'Colonias Unidas',
    'Las Garcitas',
    'Lapachito',
    'Capitán Solari',
    'Makallé',
    'Presidencia Roque Sáenz Peña',
    'Resistencia',
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  sameAs: [
    'https://www.facebook.com/Evenser-eventos-y-sercicios-Sociales',
    'https://www.instagram.com/evenser_Baldo',
    'https://www.tiktok.com/@evenser_',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
