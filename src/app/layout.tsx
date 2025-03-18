import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Context from '@/src/components/context'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Log Processing Dashboard',
  description: 'Real-time log processing and analytics dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Context>
          {children}
          <Toaster />
        </Context>
      </body>
    </html>
  )
} 