import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Evenser',
  description: 'Sistema de gestión funeraria y servicios sociales',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Evenser' },
  icons: { apple: '/icons/icon-192.png' },
}

export const viewport: Viewport = {
  themeColor: '#4a3f38',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
