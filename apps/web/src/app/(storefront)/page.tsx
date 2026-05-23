import { BadgeCheck, Heart, MapPin, Sprout } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      {/* Hero — single composition: H1 + sub + CTAs. Decorative SVG
          sun (top-right) and hill silhouette (bottom) give the green
          gradient real depth without any JS or third-party 3D library.
          All motion gated behind motion-safe: so prefers-reduced-motion
          users get a static composition. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8FAF6E] via-[#6B8E50] to-[#4E7038] px-6 py-24 text-white">
        <HeroSun />

        <div className="relative mx-auto max-w-5xl">
          <h1 className="font-brand text-5xl font-bold tracking-tight sm:text-6xl">
            Real food from a real farm,
            <br />
            72 acres outside Hyderabad.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            Cold-chained from our parlor to your door before breakfast. Meet the cow your ghee came
            from. Subscribe once — eat honestly every week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/subscribe"
              className="inline-flex h-11 items-center rounded-lg bg-white px-6 font-semibold text-leaf-600 shadow-elev-2 transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Start a weekly box · ₹999
            </Link>
            <Link
              href="/meet-the-farm"
              className="inline-flex h-11 items-center rounded-lg border border-white/30 bg-white/15 px-6 font-semibold backdrop-blur transition-colors hover:bg-white/25"
            >
              Watch the farm tour
            </Link>
          </div>
        </div>

        <HillSilhouette />
      </section>

      {/* Trust signals — quiet strip between hero and harvest. Lucide
          icons (no emoji) per CLAUDE.md AI-slop blacklist item #7. */}
      <section className="border-b border-border bg-card">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-4 py-8 sm:grid-cols-4">
          <li className="flex items-center gap-3">
            <BadgeCheck aria-hidden className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Certified organic</div>
              <div className="truncate text-xs text-muted-foreground">PGS-India verified</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <Heart aria-hidden className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">94% stress-free</div>
              <div className="truncate text-xs text-muted-foreground">welfare-audited hrs</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <Sprout aria-hidden className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">2.14 tCO₂e</div>
              <div className="truncate text-xs text-muted-foreground">sequestered YTD</div>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <MapPin aria-hidden className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">72 acres</div>
              <div className="truncate text-xs text-muted-foreground">outside Hyderabad</div>
            </div>
          </li>
        </ul>
      </section>

      {/* Today's harvest — product cards with custom SVG illustrations
          and a CSS-only 3D tilt on hover (perspective + rotateX/Y).
          Each <article> is a perspective container; the inner card
          rotates inside it. motion-safe: gates the tilt so reduced-
          motion users see only the lift, no rotation. */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-brand text-3xl font-bold">Today's harvest</h2>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center text-sm font-semibold text-primary hover:underline"
          >
            See all products →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <article key={p.slug} className="group [perspective:1000px]">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elev-1 transition-[transform,box-shadow] duration-300 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:[transform:translateY(-4px)_rotateX(3deg)_rotateY(-4deg)] motion-safe:group-hover:shadow-elev-3">
                <div className="flex h-44 items-center justify-center" style={{ background: p.bg }}>
                  <p.Illustration />
                </div>
                <div className="p-4">
                  <h3 className="font-brand text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-mono text-xl font-bold">{p.price}</span>
                    <span className="text-sm text-muted-foreground">{p.unit}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Trust — "Meet the cow behind your milk." CTA into traceability */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-leaf-500 bg-gradient-to-br from-leaf-50 to-turmeric-50 p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h3 className="font-brand text-3xl font-bold">Meet the cow behind your milk.</h3>
              <p className="mt-2 max-w-xl text-base text-muted-foreground">
                Every pack has a QR code. Scan it — see which animal, which plot, who milked, who
                packed. Real traceability, not a sticker.
              </p>
            </div>
            <Link
              href="/traceability"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-transform motion-safe:hover:-translate-y-0.5"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------- decorative inline SVGs (zero JS, zero asset requests) ------- */

function HeroSun() {
  return (
    <div aria-hidden className="pointer-events-none absolute right-4 top-4 sm:right-12 sm:top-10">
      {/* Soft glow behind the sun. blur-3xl is heavy but it's one element
          and it's behind the fold of the content well, so it doesn't hurt
          LCP. Pulse only when motion is allowed. */}
      <div className="absolute -inset-10 rounded-full bg-amber-300/40 blur-3xl motion-safe:animate-pulse" />
      <svg
        viewBox="0 0 100 100"
        width="72"
        height="72"
        className="relative motion-safe:animate-[spin_60s_linear_infinite] sm:h-24 sm:w-24"
      >
        <title>Sun</title>
        {/* 12 rays */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: deterministic decorative array
            key={i}
            x="48.5"
            y="4"
            width="3"
            height="14"
            rx="1.5"
            fill="#FCD34D"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        {/* Core */}
        <circle cx="50" cy="50" r="18" fill="#FDE68A" />
        <circle cx="50" cy="50" r="13" fill="#FCD34D" />
      </svg>
    </div>
  );
}

function HillSilhouette() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="absolute -bottom-px left-0 right-0 h-12 w-full text-[#3F5E2D] opacity-40"
    >
      <title>Rolling hills</title>
      <path
        d="M0,80 C200,30 400,90 600,55 C800,25 1000,75 1200,45 L1200,120 L0,120 Z"
        fill="currentColor"
      />
      <path
        d="M0,100 C150,70 350,110 600,80 C850,55 1050,100 1200,75 L1200,120 L0,120 Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

function MilkBottleIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="90" height="90" className="text-emerald-900">
      <title>Milk bottle</title>
      {/* Cap */}
      <rect
        x="42"
        y="14"
        width="16"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
      />
      {/* Neck taper into bottle */}
      <path
        d="M44 22 L44 30 L36 38 L36 82 Q36 88 42 88 L58 88 Q64 88 64 82 L64 38 L56 30 L56 22"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="white"
        strokeLinejoin="round"
      />
      {/* Milk level */}
      <line
        x1="38"
        y1="62"
        x2="62"
        y2="62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function GheeJarIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92" className="text-emerald-900">
      <title>Ghee jar</title>
      {/* Lid */}
      <rect
        x="30"
        y="16"
        width="40"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
      />
      {/* Jar body */}
      <path
        d="M34 25 L34 82 Q34 90 42 90 L58 90 Q66 90 66 82 L66 25"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="rgba(255,255,255,0.6)"
        strokeLinejoin="round"
      />
      {/* Ghee surface curve */}
      <path d="M34 42 Q50 37 66 42" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function EggsIllustration() {
  return (
    <svg viewBox="0 0 120 100" width="100" height="84" className="text-amber-50">
      <title>Three eggs</title>
      {/* Three eggs — slightly overlapping, back ones smaller */}
      <ellipse cx="40" cy="60" rx="13" ry="17" fill="currentColor" opacity="0.92" />
      <ellipse cx="80" cy="60" rx="13" ry="17" fill="currentColor" opacity="0.92" />
      <ellipse cx="60" cy="50" rx="14" ry="18" fill="currentColor" />
      {/* Subtle highlights */}
      <ellipse cx="36" cy="52" rx="2.5" ry="3.5" fill="white" opacity="0.5" />
      <ellipse cx="76" cy="52" rx="2.5" ry="3.5" fill="white" opacity="0.5" />
      <ellipse cx="56" cy="42" rx="3" ry="4" fill="white" opacity="0.5" />
    </svg>
  );
}

function PalakIllustration() {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92" className="text-yellow-50">
      <title>Spinach leaves</title>
      {/* Leaf 1 (back) */}
      <path d="M50 80 Q35 60 40 35 Q55 28 62 50 Q60 72 50 80 Z" fill="currentColor" opacity="0.7" />
      {/* Leaf 2 (front, larger) */}
      <path d="M55 85 Q40 70 38 42 Q56 32 72 52 Q68 78 55 85 Z" fill="currentColor" />
      {/* Veins */}
      <line
        x1="55"
        y1="85"
        x2="55"
        y2="40"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="80"
        x2="50"
        y2="40"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------- product data ------- */

const PRODUCTS = [
  {
    slug: 'a2-milk',
    name: 'A2 Gir cow milk',
    desc: 'Raw, non-homogenized · from Ganga & family',
    price: '₹95',
    unit: '/ litre',
    Illustration: MilkBottleIllustration,
    bg: 'linear-gradient(135deg,#FFF8E1,#FFE082)',
  },
  {
    slug: 'a2-ghee',
    name: 'Bilona A2 ghee',
    desc: 'Hand-churned from curd · no shortcuts',
    price: '₹1,850',
    unit: '/ 500ml',
    Illustration: GheeJarIllustration,
    bg: 'linear-gradient(135deg,#FFECB3,#FFB74D)',
  },
  {
    slug: 'kadaknath-eggs',
    name: 'Kadaknath black eggs',
    desc: 'Free-range · higher protein',
    price: '₹240',
    unit: '/ 6 ct',
    Illustration: EggsIllustration,
    // Earthy tan -> warm dark brown. Matches the actual blackish-brown
    // colour of Kadaknath shells; old purple gradient was disconnected
    // from the product.
    bg: 'linear-gradient(135deg,#D7CCC0,#5C4B3F)',
  },
  {
    slug: 'palak',
    name: 'Palak (spinach)',
    desc: 'Plot 3 · harvested 6:40 AM today',
    price: '₹60',
    unit: '/ 500g',
    Illustration: PalakIllustration,
    bg: 'linear-gradient(135deg,#AED581,#558B2F)',
  },
];
