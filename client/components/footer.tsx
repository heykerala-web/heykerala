import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t mt-16 bg-white">
      <div className="container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-outfit font-bold text-lg text-foreground mb-4 tracking-tight">Hey Kerala</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your guide to God&apos;s Own Country — places, events and stays curated for you.
          </p>
        </div>
        <div>
          <h4 className="font-outfit font-bold text-foreground mb-4">Explore</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/places">
                Places
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/stay">
                Stays
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/events">
                Events
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-outfit font-bold text-foreground mb-4">Company</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-outfit font-bold text-foreground mb-4">Follow</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#" aria-label="Instagram">
                Instagram
              </a>
            </li>
            <li>
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#" aria-label="Twitter/X">
                Twitter/X
              </a>
            </li>
            <li>
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#" aria-label="YouTube">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
        © {new Date().getFullYear()} Hey Kerala. All rights reserved.
      </div>
    </footer>
  )
}
