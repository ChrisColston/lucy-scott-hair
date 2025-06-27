import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://lucyscotthair.co.uk'),
  title: 'Lucy Scott • Hair • Hair Styling in Flushing, Cornwall',
  description: 'Professional hair cutting, colouring, and styling services for all ages and genders in Flushing, Cornwall. Environmentally conscious salon with personalised appointments on Tuesdays and Thursdays.',
  keywords: 'hair salon, hair stylist, hair cutting, hair colouring, barber, Flushing, Cornwall, unisex salon',
  authors: [{ name: 'Lucy Scott Hair' }],
  openGraph: {
    title: 'Lucy Scott • Hair • Hair Styling in Flushing, Cornwall',
    description: 'Professional hair cutting, colouring, and styling services for all ages and genders in Flushing, Cornwall.',
    url: 'https://lucyscotthair.co.uk',
    siteName: 'Lucy Scott Hair',
    locale: 'en_GB',
    type: 'website',
    images: [{
      url: '/lucy-scott-social-share.png',
      width: 1200,
      height: 630,
      alt: 'Lucy Scott Hair - Professional Hair Styling in Flushing',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucy Scott • Hair • Hair Styling in Flushing, Cornwall',
    description: 'Professional hair cutting, colouring, and styling services for all ages and genders in Flushing, Cornwall.',
    images: ['/lucy-scott-social-share.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="h-full m-0 p-0">{children}</body>
    </html>
  )
}
