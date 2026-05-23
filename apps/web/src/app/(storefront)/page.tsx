import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8FAF6E] via-[#6B8E50] to-[#4E7038] px-6 py-24 text-white">
        <div className="absolute right-8 top-8 flex flex-wrap justify-end gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
            🌾 PGS-India
          </span>
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
            ❤️ 94% stress-free hrs
          </span>
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
            🌧 2.14 tCO₂e sequestered
          </span>
        </div>
        <div className="mx-auto max-w-5xl">
          <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-sm backdrop-blur">
            🌾 Certified organic · PGS-India
          </span>
          <h1 className="mt-4 font-brand text-5xl font-bold tracking-tight sm:text-6xl">
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
              className="rounded-lg bg-white px-6 py-3.5 font-semibold text-leaf-600 shadow-elev-2"
            >
              🛒 Start a weekly box · ₹999
            </Link>
            <Link
              href="/meet-the-farm"
              className="rounded-lg border border-white/30 bg-white/15 px-6 py-3.5 font-semibold backdrop-blur"
            >
              ▶ Watch the farm tour
            </Link>
          </div>
        </div>
      </section>

      {/* Today's harvest */}
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
            <article
              key={p.slug}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-elev-1 transition-all hover:-translate-y-0.5 hover:shadow-elev-3"
            >
              <div
                className="flex h-44 items-center justify-center text-6xl"
                style={{ background: p.bg }}
              >
                {p.emoji}
              </div>
              <div className="p-4">
                <h3 className="font-brand text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-mono text-xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.unit}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Trust */}
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
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const PRODUCTS = [
  {
    slug: 'a2-milk',
    name: 'A2 Gir cow milk',
    desc: 'Raw, non-homogenized · from Ganga & family',
    price: '₹95',
    unit: '/ litre',
    emoji: '🥛',
    bg: 'linear-gradient(135deg,#FFF8E1,#FFE082)',
  },
  {
    slug: 'a2-ghee',
    name: 'Bilona A2 ghee',
    desc: 'Hand-churned from curd · no shortcuts',
    price: '₹1,850',
    unit: '/ 500ml',
    emoji: '🧈',
    bg: 'linear-gradient(135deg,#FFECB3,#FFB74D)',
  },
  {
    slug: 'kadaknath-eggs',
    name: 'Kadaknath black eggs',
    desc: 'Free-range · higher protein',
    price: '₹240',
    unit: '/ 6 ct',
    emoji: '🥚',
    bg: 'linear-gradient(135deg,#F3E5F5,#CE93D8)',
  },
  {
    slug: 'palak',
    name: 'Palak (spinach)',
    desc: 'Plot 3 · harvested 6:40 AM today',
    price: '₹60',
    unit: '/ 500g',
    emoji: '🥬',
    bg: 'linear-gradient(135deg,#DCEDC8,#AED581)',
  },
];
