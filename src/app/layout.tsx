import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { newsReader } from '@/assets/fonts'

export const metadata: Metadata = {
  title: 'HoliBobs',
  description: 'Save for your holidays and get rewards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <Providers>
      <body className={`${newsReader.className} min-h-screen`}>
        <Header />
        <div className="max-w-4xl mx-auto">
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
      </Providers>
    </html>
  )
}
