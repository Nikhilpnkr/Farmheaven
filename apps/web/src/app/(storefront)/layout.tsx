import Link from 'next/link';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-brand text-2xl font-bold tracking-tight">
            FarmHeaven
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
            <Link href="/subscribe" className="hover:text-primary">
              Subscribe
            </Link>
            <Link href="/meet-the-farm" className="hover:text-primary">
              Meet the farm
            </Link>
            <Link
              href="/shop"
              className="rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
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
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/shop">All products</Link>
              </li>
              <li>
                <Link href="/subscribe">Weekly boxes</Link>
              </li>
              <li>
                <Link href="/farm-tour">Farm tours</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Company
            </h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/meet-the-farm">About us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/traceability">Traceability</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Legal
            </h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of service</Link>
              </li>
              <li>
                <Link href="/data-request">My data (DPDPA)</Link>
              </li>
              <li>
                <Link href="/grievance">Grievance officer</Link>
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
