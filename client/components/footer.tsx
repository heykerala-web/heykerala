import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t mt-16 bg-white">
      <div className="container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-outfit font-bold text-lg text-foreground mb-4 tracking-tight">Hey Kerala</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("footer_tagline")}
          </p>
        </div>
        <div>
          <h4 className="font-outfit font-bold text-foreground mb-4">{t("nav_explore")}</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/places">
                {t("locations")}
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/stay">
                {t("nav_stay")}
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/events">
                {t("nav_events")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-outfit font-bold text-foreground mb-4">{t("footer_company")}</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/about">
                {t("footer_about")}
              </Link>
            </li>
            <li>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/contact">
                {t("footer_contact")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-outfit font-bold text-foreground mb-4">{t("footer_follow")}</h4>
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
        © {new Date().getFullYear()} Hey Kerala. {t("footer_rights")}
      </div>
    </footer>
  )
}
