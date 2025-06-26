import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://lucyscotthair.co.uk'),
  title: 'Lucy Scott • Hair • Expert Hair Styling in Flushing',
  description: 'Professional hair cutting, colouring, and styling services for all ages and genders in Flushing. Environmentally conscious salon with personalised appointments on Tuesdays and Thursdays.',
  keywords: 'hair salon, hair stylist, hair cutting, hair colouring, barber, Flushing, Cornwall, unisex salon',
  authors: [{ name: 'Lucy Scott Hair' }],
  openGraph: {
    title: 'Lucy Scott • Hair • Expert Hair Styling in Flushing',
    description: 'Professional hair cutting, colouring, and styling services for all ages and genders in Flushing.',
    url: 'https://lucyscotthair.co.uk',
    siteName: 'Lucy Scott Hair',
    locale: 'en_GB',
    type: 'website',
    images: [{
      url: '/lucy-scott-hair-concept.png',
      width: 1200,
      height: 630,
      alt: 'Lucy Scott Hair - Professional Hair Styling in Flushing',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucy Scott • Hair • Expert Hair Styling in Flushing',
    description: 'Professional hair cutting, colouring, and styling services for all ages and genders in Flushing.',
    images: ['/lucy-scott-hair-concept.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 p-0">{children}</body>
    </html>
  )
}
