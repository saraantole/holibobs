'use client';

import { caprasimo } from '@/assets/fonts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/100 to-transparent backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-4">
        <div className="bg-orange rounded-full flex items-center justify-center w-9 h-9">
          <span
            className={`${caprasimo.className} text-white text-xl font-bold leading-none -mb-[3px]`}
          >
            H
          </span>
        </div>
        <Link
          href="/"
          className={`${caprasimo.className} text-navyBlue text-2xl`}
        >
          HoliBobs
        </Link>
      </div>
    </header>
  );
}
