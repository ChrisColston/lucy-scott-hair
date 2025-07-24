import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lucy Scott Hair - Business Tracker',
  description: 'Private business tracking application for Lucy Scott Hair salon',
  themeColor: '#FDF5EA',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lucy Hair Tracker',
  },
  manifest: '/tracker/manifest.json',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ]
  }
}

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200;0,300;0,400;0,600;0,700;1,200;1,300;1,400&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap" rel="stylesheet" />
      
      {children}
    </>
  )
}
