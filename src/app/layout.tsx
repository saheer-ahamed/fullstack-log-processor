import type { Metadata } from 'next'
import './globals.css'
import Context from '../components/context'
import { Toaster } from 'react-hot-toast'

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
      <body>
        <Context>
          {children}
          <Toaster />
        </Context>
      </body>
    </html>
  )
} 