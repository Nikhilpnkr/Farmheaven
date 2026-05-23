import { Phone } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BananaIllustration,
  CurdPotIllustration,
  EggsIllustration,
  GheeJarIllustration,
  HoneyJarIllustration,
  MethiIllustration,
  MilkBottleIllustration,
  PalakIllustration,
  PaneerBlockIllustration,
  TomatoesIllustration,
} from '../_components/product-illustrations';

export const metadata: Metadata = {
  title: 'Shop · the full catalogue',
  description:
    'Milk, ghee, curd, paneer, free-range eggs, organic produce — everything FarmHeaven ships, with provenance on every pack.',
};

type Category = 'all' | 'dairy' | 'eggs' | 'produce' | 'pantry';

const CATEGORIES: Array<{ slug: Category; label: string }> = [
  { slug: 'all', label: 'Everything' },
  { slug: 'dairy', label: 'Dairy' },
  { slug: 'eggs', label: 'Eggs' },
  { slug: 'produce', label: 'Produce' },
  { slug: 'pantry', label: 'Pantry' },
];

type Product = {
  slug: string;
  name: string;
  desc: string;
  price: string;
  unit: string;
  category: Exclude<Category, 'all'>;
  /** Optional freshness tag — e.g. 'harvested today', 'milked this morning' */
  fresh?: string;
  Illustration: React.ComponentType;
  bg: string;
};

const PRODUCTS: Product[] = [
  // Dairy
  {
    slug: 'a2-milk',
    name: 'A2 Gir cow milk',
    desc: 'Raw, non-homogenized · from Ganga & family',
    price: '₹95',
    unit: '/ litre',
    category: 'dairy',
    fresh: 'Milked this morning',
    Illustration: MilkBottleIllustration,
    bg: 'linear-gradient(135deg,#FFF8E1,#FFE082)',
  },
  {
    slug: 'a2-ghee',
    name: 'Bilona A2 ghee',
    desc: 'Hand-churned from curd · no shortcuts',
    price: '₹1,850',
    unit: '/ 500 ml',
    category: 'dairy',
    Illustration: GheeJarIllustration,
    bg: 'linear-gradient(135deg,#FFECB3,#FFB74D)',
  },
  {
    slug: 'curd',
    name: 'Set curd',
    desc: 'Slow-set in earthen pot · live cultures',
    price: '₹120',
    unit: '/ 500 g',
    category: 'dairy',
    fresh: 'Set last night',
    Illustration: CurdPotIllustration,
    bg: 'linear-gradient(135deg,#FFF8E1,#F5E3B3)',
  },
  {
    slug: 'paneer',
    name: 'Fresh paneer',
    desc: 'From the same morning milk · no acids',
    price: '₹450',
    unit: '/ 250 g',
    category: 'dairy',
    fresh: 'Made today',
    Illustration: PaneerBlockIllustration,
    bg: 'linear-gradient(135deg,#F5F0E5,#E8DCC3)',
  },
  // Eggs
  {
    slug: 'kadaknath-eggs',
    name: 'Kadaknath black eggs',
    desc: 'Free-range · higher protein, lower fat',
    price: '₹240',
    unit: '/ 6 ct',
    category: 'eggs',
    Illustration: EggsIllustration,
    bg: 'linear-gradient(135deg,#D7CCC0,#5C4B3F)',
  },
  // Produce
  {
    slug: 'palak',
    name: 'Palak (spinach)',
    desc: 'Plot A3 · harvested 6:40 AM today',
    price: '₹60',
    unit: '/ 500 g',
    category: 'produce',
    fresh: 'Harvested today',
    Illustration: PalakIllustration,
    bg: 'linear-gradient(135deg,#AED581,#558B2F)',
  },
  {
    slug: 'methi',
    name: 'Methi (fenugreek)',
    desc: 'Plot A5 · tender leaves only',
    price: '₹50',
    unit: '/ 250 g',
    category: 'produce',
    fresh: 'Harvested today',
    Illustration: MethiIllustration,
    bg: 'linear-gradient(135deg,#B8D597,#558B2F)',
  },
  {
    slug: 'tomatoes',
    name: 'Heirloom tomatoes',
    desc: 'Plot A4 · vine-ripened, not gas-ripened',
    price: '₹80',
    unit: '/ kg',
    category: 'produce',
    fresh: 'Picked this morning',
    Illustration: TomatoesIllustration,
    bg: 'linear-gradient(135deg,#FFE0B2,#FFB74D)',
  },
  {
    slug: 'bananas',
    name: 'Hill bananas',
    desc: 'Tree-ripened · short, dense, sweet',
    price: '₹70',
    unit: '/ dozen',
    category: 'produce',
    Illustration: BananaIllustration,
    bg: 'linear-gradient(135deg,#FFF59D,#FFD54F)',
  },
  // Pantry
  {
    slug: 'wild-honey',
    name: 'Wild forest honey',
    desc: 'Apis cerana indica · single-origin · raw',
    price: '₹650',
    unit: '/ 500 g',
    category: 'pantry',
    Illustration: HoneyJarIllustration,
    bg: 'linear-gradient(135deg,#FFE082,#FFA000)',
  },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const rawCategory = params.category;
  const active: Category =
    rawCategory && (CATEGORIES.find((c) => c.slug === rawCategory)?.slug ?? null)
      ? (rawCategory as Category)
      : 'all';

  const visible = active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <main>
      {/* Hero — short, no decorative SVG. Shop is utility, the hero is
          just a name + a sentence. */}
      <section className="border-b border-border bg-card px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Catalogue · {visible.length} items
          </p>
          <h1 className="mt-3 font-brand text-4xl font-bold tracking-tight sm:text-5xl">
            Everything we ship.
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Every pack has a QR code linking back to which animal or plot it came from. Order on
            WhatsApp for now — cart and online payment land in Phase 4.
          </p>
        </div>
      </section>

      {/* Category pills. URL-driven via ?category=X so links are
          shareable and back/forward works. Active state on the pill
          that matches the current ?category. */}
      <section className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <ul className="mx-auto flex max-w-5xl flex-wrap gap-2" aria-label="Filter by category">
          {CATEGORIES.map((c) => {
            const isActive = c.slug === active;
            const href = c.slug === 'all' ? '/shop' : `/shop?category=${c.slug}`;
            return (
              <li key={c.slug}>
                <Link
                  href={href}
                  scroll={false}
                  aria-current={isActive ? 'true' : undefined}
                  className={`inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-elev-1'
                      : 'border border-border bg-card hover:bg-muted'
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Product grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {visible.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No items in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA — subscribe + trace */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#4E7038] to-[#2F4D24] p-10 text-white sm:p-12">
          <h2 className="font-brand text-3xl font-bold sm:text-4xl">
            Or skip ordering altogether.
          </h2>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Subscribe and we'll deliver a curated weekly box. Cancel any time, no auto-renewal
            tricks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/subscribe"
              className="inline-flex h-11 items-center rounded-lg bg-white px-6 font-semibold text-leaf-700 shadow-elev-2 transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Start a weekly box · ₹999
            </Link>
            <Link
              href="/traceability"
              className="inline-flex h-11 items-center rounded-lg border border-white/30 bg-white/10 px-6 font-semibold backdrop-blur transition-colors hover:bg-white/20"
            >
              How traceability works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  // Encode product name + price into the WhatsApp message so the user
  // can see what was requested. Phase 4 replaces this with a real cart.
  const whatsappMessage = encodeURIComponent(
    `Hi FarmHeaven — I'd like to order ${product.name} (${product.price}${product.unit}).`,
  );
  const whatsappHref = `https://wa.me/919800000001?text=${whatsappMessage}`;

  return (
    <article className="group [perspective:1000px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elev-1 transition-[transform,box-shadow] duration-300 ease-out motion-safe:group-hover:[transform:translateY(-4px)_rotateX(2deg)_rotateY(-3deg)] motion-safe:group-hover:shadow-elev-3">
        <div
          className="relative flex h-44 items-center justify-center"
          style={{ background: product.bg }}
        >
          <product.Illustration />
          {product.fresh ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-elev-1">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse"
              />
              {product.fresh}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div>
            <h3 className="font-brand text-lg font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.desc}</p>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xl font-bold">{product.price}</span>
            <span className="text-sm text-muted-foreground">{product.unit}</span>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <Phone aria-hidden className="size-4" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
