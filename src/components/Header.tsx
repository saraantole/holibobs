'use client'

import Link from 'next/link'

export default function Header() {
  return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/100 to-transparent backdrop-blur-sm max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="bg-orange rounded-full flex items-center justify-center w-10 h-10">
            <span className="text-white text-xl font-bold leading-none -mb-[3px]">H</span>
          </div>
          <Link 
            href="/"
            className="text-navyBlue font-bold text-xl"
          >
            HoliBobs
          </Link>
      </header>
  )
}
