import Link from "next/link";

export default function Footer() {
  return (
      <footer className="m-6 pb-20 flex justify-center gap-8 text-sm">
        <Link href="/terms" className="text-gray-700 hover:text-gray-900 transition-colors">
          Terms of Use
        </Link>
        <Link href="/community" className="text-gray-700 hover:text-gray-900 transition-colors">
          Community
        </Link>
      </footer>
  )
}
