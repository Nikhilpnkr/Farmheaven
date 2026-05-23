import {
  BadgeCheck,
  CalendarClock,
  Heart,
  MapPin,
  Package,
  Snowflake,
  Sprout,
  Truck,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/* Sample data — replaced by a DB query in Phase 4 (Storefront +
   Orders). The slug grammar is intentionally human-readable so QR
   codes printed on packs are debuggable by eye. */
const SAMPLES: Record<string, TraceData> = {
  'A2-MILK-2026-05-23-001': {
    product: {
      name: 'A2 Gir cow milk',
      sku: 'A2-MILK · 1 L bottle',
      batch: 'A2M-053',
      packedAt: '2026-05-23T06:34:00+05:30',
      bestBefore: '2026-05-26',
    },
    source: {
      kind: 'animal',
      tag: 'GIR-001',
      name: 'Ganga',
      detail: 'Gir cow · 6 yrs · Foundation cow',
      structure: 'Parlor stall 2',
    },
    timeline: [
      {
        time: '05:42 AM',
        title: 'Milked',
        detail: 'Operator Rajesh · 12.2 L collected · pre-milk udder check passed',
        IconKey: 'cow',
      },
      {
        time: '06:01 AM',
        title: 'Chilled in-line to 4 °C',
        detail: 'In-line plate chiller · output temp 3.8 °C · holding tank 4.1 °C',
        IconKey: 'cold',
      },
      {
        time: '06:34 AM',
        title: 'Bottled and capped',
        detail: 'Bottle line 1 · batch A2M-053 · raw (no pasteurisation)',
        IconKey: 'pack',
      },
      {
        time: '07:10 AM',
        title: 'Dispatched',
        detail: 'Van TS-09-AB-1842 · cold-tank 4.6 °C · driver Kiran',
        IconKey: 'truck',
      },
      {
        time: 'pending',
        title: 'Out for delivery',
        detail: 'ETA Hyderabad by 9:30 AM · cold-chain monitored every 5 min',
        IconKey: 'deliver',
      },
    ],
    certifications: [
      {
        Icon: BadgeCheck,
        label: 'PGS-India certified organic',
        detail: 'Cert ID PGS-IN-AP-2026-0182',
      },
      { Icon: Heart, label: 'Welfare-audited', detail: 'Animal welfare logs available' },
      { Icon: Sprout, label: 'Net carbon positive', detail: '2.14 tCO₂e sequestered YTD' },
    ],
  },
  'PALAK-2026-05-23-A3': {
    product: {
      name: 'Palak (spinach)',
      sku: 'PALAK · 500 g bunch',
      batch: 'PLK-A3-088',
      packedAt: '2026-05-23T07:20:00+05:30',
      bestBefore: '2026-05-25',
    },
    source: {
      kind: 'plot',
      tag: 'PLOT-A3',
      name: 'Plot A3',
      detail: '0.8 acres · drip-irrigated · plot rotation cycle 4',
      structure: '72-acre farm, outside Hyderabad',
    },
    timeline: [
      {
        time: '06:40 AM',
        title: 'Harvested',
        detail: 'Plot A3 · 38 bunches cut · field temp 22 °C',
        IconKey: 'sprout',
      },
      {
        time: '07:05 AM',
        title: 'Washed and cooled',
        detail: 'Triple-wash, ice-cooled to 4 °C in 18 min',
        IconKey: 'cold',
      },
      {
        time: '07:20 AM',
        title: 'Packed',
        detail: 'Compostable bag · batch PLK-A3-088 · 500 g each',
        IconKey: 'pack',
      },
      {
        time: 'pending',
        title: 'Awaiting dispatch',
        detail: 'On the 8:30 AM van schedule',
        IconKey: 'truck',
      },
    ],
    certifications: [
      {
        Icon: BadgeCheck,
        label: 'PGS-India certified organic',
        detail: 'Cert ID PGS-IN-AP-2026-0182',
      },
      { Icon: Sprout, label: 'No-till regenerative', detail: 'Cover-cropped 7 months/year' },
    ],
  },
};

type TraceData = {
  product: {
    name: string;
    sku: string;
    batch: string;
    packedAt: string;
    bestBefore: string;
  };
  source: {
    kind: 'animal' | 'plot';
    tag: string;
    name: string;
    detail: string;
    structure: string;
  };
  timeline: Array<{
    time: string;
    title: string;
    detail: string;
    IconKey: 'cow' | 'cold' | 'pack' | 'truck' | 'deliver' | 'sprout';
  }>;
  certifications: Array<{
    Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    label: string;
    detail: string;
  }>;
};

const STEP_ICONS = {
  cow: Heart,
  cold: Snowflake,
  pack: Package,
  truck: Truck,
  deliver: MapPin,
  sprout: Sprout,
} as const;

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = SAMPLES[slug];
  if (!data) return { title: 'Trace · not found' };
  return {
    title: `${data.product.name} · ${data.product.batch} · traceability`,
    description: `Source: ${data.source.name}. Packed ${data.product.packedAt.slice(0, 10)}. Full timeline, cold-chain log, and certifications.`,
  };
}

export default async function TraceSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = SAMPLES[slug];
  if (!data) notFound();

  // JSON-LD Product schema per CLAUDE.md §8 (storefront-readiness).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.product.name,
    sku: data.product.sku,
    batchNumber: data.product.batch,
    productionDate: data.product.packedAt,
    additionalProperty: data.certifications.map((c) => ({
      '@type': 'PropertyValue',
      name: c.label,
      value: c.detail,
    })),
    brand: { '@type': 'Organization', name: 'FarmHeaven' },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is data we own, not user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — quieter than the marketing pages. This is a utility
          page (the user got here by scanning), so the H1 just states
          what they bought and the inline 'Verified' chip confirms it. */}
      <section className="border-b border-border bg-gradient-to-br from-leaf-50 to-turmeric-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {data.product.sku} · Batch {data.product.batch}
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
              <BadgeCheck aria-hidden className="size-4" />
              Verified
            </span>
          </div>
          <h1 className="mt-3 font-brand text-3xl font-bold tracking-tight sm:text-4xl">
            {data.product.name}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Packed{' '}
            <time dateTime={data.product.packedAt} className="font-mono text-foreground">
              {formatDateTime(data.product.packedAt)}
            </time>
            . Best before{' '}
            <time dateTime={data.product.bestBefore} className="font-mono text-foreground">
              {data.product.bestBefore}
            </time>
            .
          </p>
        </div>
      </section>

      {/* Source — the headline thing the customer wants: "where did
          this come from?". Animal or plot, with a stylised portrait /
          schematic. */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Source
          </p>
          <h2 className="mt-2 font-brand text-2xl font-bold">
            {data.source.kind === 'animal' ? 'From this animal.' : 'From this plot.'}
          </h2>

          <div className="mt-6 flex items-start gap-5">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-leaf-50">
              {data.source.kind === 'animal' ? <SourceCow /> : <SourcePlot />}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-3">
                <h3 className="font-brand text-2xl font-bold">{data.source.name}</h3>
                <span className="font-mono text-xs text-muted-foreground">{data.source.tag}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{data.source.detail}</p>
              <p className="mt-3 text-sm text-foreground/80">
                <MapPin aria-hidden className="mr-1 inline size-4 text-primary align-[-2px]" />
                {data.source.structure}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline — chronological log of every event that happened to
          this batch. The vertical line connects dots; each dot animates
          its drawn-in stroke on viewport-enter via pure CSS (motion-safe). */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Journey</p>
        <h2 className="mt-2 font-brand text-2xl font-bold">Where it's been.</h2>

        <ol className="mt-8 relative space-y-7 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-primary/20">
          {data.timeline.map((step) => {
            const Icon = STEP_ICONS[step.IconKey];
            const pending = step.time === 'pending';
            return (
              <li key={step.title} className="relative flex items-start gap-5">
                <div
                  className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 ${
                    pending
                      ? 'border-dashed border-muted-foreground/40 bg-card text-muted-foreground'
                      : 'border-primary bg-primary/10 text-primary'
                  }`}
                >
                  <Icon aria-hidden className="size-4" />
                </div>
                <div className="min-w-0 pt-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-brand text-lg font-bold">{step.title}</h3>
                    <span
                      className={`font-mono text-xs ${
                        pending ? 'text-muted-foreground italic' : 'text-muted-foreground'
                      }`}
                    >
                      {step.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/85">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Certifications */}
      <section className="border-t border-border bg-card py-14">
        <div className="mx-auto max-w-3xl px-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Certifications & audits
          </p>
          <h2 className="mt-2 font-brand text-2xl font-bold">What stands behind this pack.</h2>

          <ul className="mt-6 space-y-4">
            {data.certifications.map((c) => (
              <li key={c.label} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-leaf-50 text-primary">
                  <c.Icon aria-hidden className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold">{c.label}</div>
                  <div className="text-sm text-muted-foreground">{c.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-elev-1">
          <h3 className="font-brand text-xl font-bold">Liked what you got?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Every pack from this farm has a page like this one. Subscribe and you'll get a fresh box
            every week, each item tied to its own trace.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/subscribe"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Start a weekly box · ₹999
            </Link>
            <Link
              href="/meet-the-farm"
              className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-5 font-semibold transition-colors hover:bg-muted"
            >
              Meet the farm
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------- formatters + decorative SVG -------------- */

function formatDateTime(iso: string): string {
  // Server-side render in IST per CLAUDE.md project conventions.
  // Toy-grade format — replace with date-fns-tz formatInTimeZone when
  // the lib/date.ts helpers exist (CLAUDE.md project-specific conventions).
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function SourceCow() {
  return (
    <svg viewBox="0 0 80 80" width="60" height="60" className="text-emerald-900">
      <title>Cow source</title>
      <ellipse
        cx="40"
        cy="44"
        rx="22"
        ry="20"
        fill="white"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M24 30 Q15 18 18 8 Q24 18 30 28"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M56 30 Q65 18 62 8 Q56 18 50 28"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="40" cy="55" rx="11" ry="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="36" cy="55" rx="1" ry="1.5" fill="currentColor" />
      <ellipse cx="44" cy="55" rx="1" ry="1.5" fill="currentColor" />
      <circle cx="32" cy="40" r="1.8" fill="currentColor" />
      <circle cx="48" cy="40" r="1.8" fill="currentColor" />
    </svg>
  );
}

function SourcePlot() {
  return (
    <svg viewBox="0 0 80 80" width="64" height="64" className="text-emerald-900">
      <title>Crop plot</title>
      {/* Isometric plot tile */}
      <path
        d="M40 14 L66 28 L40 42 L14 28 Z"
        fill="#9BC07F"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 28 L14 42 L40 56 L40 42 Z" fill="#7FA866" opacity="0.7" />
      <path d="M40 42 L40 56 L66 42 L66 28 Z" fill="#558B2F" opacity="0.7" />
      {/* Tiny rows of crops on the top face */}
      <line x1="22" y1="30" x2="36" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="28" y1="33" x2="42" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="34" y1="36" x2="48" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="40" y1="39" x2="54" y2="31" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
