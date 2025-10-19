import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="m-6 pb-20 flex justify-center gap-8 text-sm sticky bottom-6 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[300px] w-[85vw] mx-auto md:mx-0">
      <Link href="/" className="underline">
        Terms of Use
      </Link>
      <Link href="/" className="underline">
        Community
      </Link>
    </footer>
  );
}
