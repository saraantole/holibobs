'use client';

import { usePathname } from 'next/navigation';
import { newsReader } from '@/assets/fonts';

export default function GlobalStyleWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <body
      className={`${newsReader.className} min-h-screen ${isHomepage ? 'bg-lightBlue' : 'bg-blue'} text-darkBlue`}
    >
      {children}
    </body>
  );
}
