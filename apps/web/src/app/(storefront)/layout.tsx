import Link from 'next/link';

// Shared hitbox class for inline text links. Forces every interactive
// element to clear the 44x44 iOS HIG floor required by CLAUDE.md §1
// even where the visual text is much shorter. `inline-flex` keeps the
// link inline-with-text in the header; the footer turns it into `flex`
// so the hit area fills the column width (44px tall is the constraint
// that matters there).
const navLink = 'inline-flex h-11 items-center hover:text-primary';
const footerLink = 'flex h-11 items-center hover:text-primary';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center font-brand text-2xl font-bold tracking-tight"
          >
            FarmHeaven
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium sm:gap-6">
            <Link href="/shop" className={navLink}>
              Shop
            </Link>
            <Link href="/subscribe" className={navLink}>
              Subscribe
            </Link>
            <Link href="/meet-the-farm" className={navLink}>
              Meet the farm
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
            >
              Start a weekly box
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-20 border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4">
          <div>
            <div className="font-brand text-lg font-bold">FarmHeaven</div>
            <p className="mt-2 text-sm text-muted-foreground">
              72 acres outside Hyderabad. Certified organic. Since 2026.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Shop
            </h4>
            <ul className="mt-2 text-sm">
              <li>
                <Link href="/shop" className={footerLink}>
                  All products
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className={footerLink}>
                  Weekly boxes
                </Link>
              </li>
              <li>
                <Link href="/farm-tour" className={footerLink}>
                  Farm tours
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Company
            </h4>
            <ul className="mt-2 text-sm">
              <li>
                <Link href="/meet-the-farm" className={footerLink}>
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={footerLink}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/traceability" className={footerLink}>
                  Traceability
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Legal
            </h4>
            <ul className="mt-2 text-sm">
              <li>
                <Link href="/privacy" className={footerLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={footerLink}>
                  Terms of service
                </Link>
              </li>
              <li>
                <Link href="/data-request" className={footerLink}>
                  My data (DPDPA)
                </Link>
              </li>
              <li>
                <Link href="/grievance" className={footerLink}>
                  Grievance officer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
            <span>© 2026 FarmHeaven Pvt Ltd · All rights reserved</span>
            <span>Made with 🌱 in Hyderabad · Compliant with DPDPA 2023</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
