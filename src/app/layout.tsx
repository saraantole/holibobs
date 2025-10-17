import type { Metadata } from 'next'
import { Newsreader } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const newsReader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
})

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
