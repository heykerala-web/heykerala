import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t mt-16 bg-white">
      <div className="container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-semibold">Hey Kerala</h3>
          <p className="mt-2 text-sm text-gray-700">
            Your guide to God&apos;s Own Country — places, events and stays curated for you.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Explore</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" href="/places">
                Places
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/hotels">
                Hotels
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/events">
                Events
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link className="hover:underline" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Follow</h4>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <a className="hover:underline" href="#" aria-label="Instagram">
                Instagram
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#" aria-label="Twitter/X">
                Twitter/X
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#" aria-label="YouTube">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Hey Kerala. All rights reserved.
      </div>
    </footer>
  )
}
