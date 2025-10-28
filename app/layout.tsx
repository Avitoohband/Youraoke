import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Youraoke - Your Karaoke Companion',
  description: 'Manage your favorite singers and songs, search for karaoke on YouTube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

