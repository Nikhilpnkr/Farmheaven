import { BadgeCheck, Heart, Snowflake, Sprout } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Meet the farm — 72 acres outside Hyderabad',
  description:
    'How FarmHeaven runs: 72 acres of certified-organic land, A2 Gir cows, Kadaknath poultry, and the people behind every pack you get.',
};

export default function MeetTheFarmPage() {
  return (
    <main>
      {/* Hero — story page, different tone from the / homepage. The
          decorative SVG is a stylized cow head facing forward, slow
          drift in opacity so it reads as a quiet presence, not a
          mascot. Motion-safe gated. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#A3B97A] via-[#788F58] to-[#4E7038] px-6 py-28 text-white">
        <CowSilhouette />

        <div className="relative mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-white/70">
            Outside Hyderabad · Since 2026
          </p>
          <h1 className="mt-4 font-brand text-5xl font-bold tracking-tight sm:text-6xl">
            One farm.
            <br />
            Seventy-two acres.
            <br />
            Zero shortcuts.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90">
            We grow food the way our grandparents would recognise — cows that walk on grass, eggs
            laid where the hens scratch, vegetables harvested before breakfast. Then we put it on a
            cold truck and bring it to your kitchen.
          </p>
        </div>

        <HillSilhouette />
      </section>

      {/* Founder note — short, intimate, fronts the actual reason
          the farm exists. Two paragraphs max — anything longer reads
          as marketing copy. */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="font-brand text-3xl font-bold">How this started.</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/90">
          <p>
            In 2024 we couldn't find honest milk in Hyderabad. Adulterated, hormone-fed, sourced
            from a thousand-cow shed where the animals never see the sun — that was the market. So
            we bought land outside the city, brought home four Gir cows, and started learning.
          </p>
          <p>
            Two years later we have 23 animals, 10 plots, a packing parlor, and a small team that
            wakes up at 5 AM because the cows do. We're not romanticising any of it. It's hard, it's
            slow, and it costs more than the supermarket version. But every pack we send out comes
            from a place we can show you.
          </p>
          <p className="font-mono text-sm text-muted-foreground">— Suprameds, founder</p>
        </div>
      </section>

      {/* The land — isometric SVG map of the 72 acres. This is the
          one place a "3D" treatment actually carries information: a
          top-down farm plot doesn't tell you what's where, but an
          isometric view does. Static SVG, no JS, no animation cost. */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              The land · 72 acres
            </p>
            <h2 className="mt-2 font-brand text-3xl font-bold">What's where.</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Ten plots, three livestock structures, one parlor, one compost yard. Every pack you
              receive can be traced back to one of these.
            </p>
          </div>

          <FarmMap />

          <ul className="mt-8 grid gap-x-6 gap-y-2 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-4">
            <li>
              <span className="mr-1 inline-block size-3 rounded bg-leaf-500 align-[-1px]" /> Crop
              plots (A1–A6)
            </li>
            <li>
              <span className="mr-1 inline-block size-3 rounded bg-turmeric-500 align-[-1px]" />{' '}
              Fodder & forage (F1, F2)
            </li>
            <li>
              <span className="mr-1 inline-block size-3 rounded bg-[#8C6E50] align-[-1px]" />{' '}
              Livestock barns (B1–B3)
            </li>
            <li>
              <span className="mr-1 inline-block size-3 rounded bg-[#D6CCC0] align-[-1px]" /> Parlor
              & compost
            </li>
          </ul>
        </div>
      </section>

      {/* The animals — five Gir cow cards, named. Replaces "anonymous
          milk" with "milk from THIS animal". Each has a portrait icon
          (a stylised side-view cow head with the right horn shape). */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            The herd · 5 milking cows
          </p>
          <h2 className="mt-2 font-brand text-3xl font-bold">Who your milk comes from.</h2>
          <p className="mt-3 text-base text-muted-foreground">
            All Gir cows. All born on this farm or one we know. We don't run a sourcing operation;
            we run a herd.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COWS.map((c) => (
            <article
              key={c.tag}
              className="group rounded-2xl border border-border bg-card p-5 shadow-elev-1 transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-elev-3"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-leaf-50">
                  <CowPortrait />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-brand text-xl font-bold">{c.name}</h3>
                    <span className="font-mono text-xs text-muted-foreground">{c.tag}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.role}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <dt className="text-muted-foreground">Age</dt>
                    <dd className="text-right font-mono">{c.age}</dd>
                    <dt className="text-muted-foreground">Yield</dt>
                    <dd className="text-right font-mono">{c.yield}</dd>
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Practices — four trust signals expanded with one line of
          context each. Mirrors the homepage trust strip but spends
          a sentence per pillar instead of a 2-word descriptor. */}
      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              How we work
            </p>
            <h2 className="mt-2 font-brand text-3xl font-bold">
              Four things we don't compromise on.
            </h2>
          </div>

          <ul className="grid gap-8 sm:grid-cols-2">
            {PRACTICES.map((p) => (
              <li key={p.title} className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-primary">
                  <p.Icon aria-hidden className="size-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-brand text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA — back to the storefront, weekly-box anchor */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#4E7038] to-[#2F4D24] p-10 text-white sm:p-14">
          <h2 className="font-brand text-3xl font-bold sm:text-4xl">Taste the difference.</h2>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Subscribe once. Get a box of milk, ghee, eggs, and seasonal vegetables every week.
            Cancel any time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/subscribe"
              className="inline-flex h-11 items-center rounded-lg bg-white px-6 font-semibold text-leaf-700 shadow-elev-2 transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Start a weekly box · ₹999
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-lg border border-white/30 bg-white/10 px-6 font-semibold backdrop-blur transition-colors hover:bg-white/20"
            >
              See the catalogue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------------- decorative SVGs ---------------------- */

function CowSilhouette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-6 top-12 w-40 opacity-15 sm:right-16 sm:w-64"
    >
      <svg viewBox="0 0 200 160" className="motion-safe:animate-pulse [animation-duration:6s]">
        <title>Cow head silhouette</title>
        {/* Head shape */}
        <path
          d="M100 30 Q60 30 50 70 Q45 100 60 125 Q80 150 100 150 Q120 150 140 125 Q155 100 150 70 Q140 30 100 30 Z"
          fill="white"
        />
        {/* Horns */}
        <path
          d="M65 50 Q40 30 35 10 Q55 25 70 55"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M135 50 Q160 30 165 10 Q145 25 130 55"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Snout */}
        <ellipse cx="100" cy="125" rx="22" ry="14" fill="rgba(0,0,0,0.15)" />
        {/* Nostrils */}
        <ellipse cx="92" cy="125" rx="2" ry="3" fill="rgba(0,0,0,0.25)" />
        <ellipse cx="108" cy="125" rx="2" ry="3" fill="rgba(0,0,0,0.25)" />
        {/* Eyes (closed/restful) */}
        <path d="M80 95 Q85 92 90 95" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" fill="none" />
        <path d="M110 95 Q115 92 120 95" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" fill="none" />
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
      className="absolute -bottom-px left-0 right-0 h-12 w-full text-[#2F4D24] opacity-50"
    >
      <title>Rolling hills</title>
      <path
        d="M0,80 C200,30 400,90 600,55 C800,25 1000,75 1200,45 L1200,120 L0,120 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Isometric farm map — labeled rhombus tiles arranged on an iso grid.
   Each "tile" is a rhombus drawn with a single SVG path. No JS, no
   animation, just spatial information. Designed at 600x420 viewBox so
   the labels read at any container width. */
function FarmMap() {
  type Tile = {
    /** Iso grid coords. (0,0) is back-center; +x goes front-right, +y goes front-left. */
    x: number;
    y: number;
    color: string;
    label: string;
    code?: string;
  };

  // 4x3 iso grid. Tile size 80 horizontal, 40 vertical (classic 2:1 iso).
  const TILE_W = 80;
  const TILE_H = 40;
  const ORIGIN_X = 300;
  const ORIGIN_Y = 80;

  const tiles: Tile[] = [
    // Back row — fodder + barns
    { x: 0, y: 0, color: '#F5C66B', label: 'Fodder', code: 'F1' },
    { x: 1, y: 0, color: '#8C6E50', label: 'Barn (Gir)', code: 'B1' },
    { x: 2, y: 0, color: '#8C6E50', label: 'Barn (buffalo)', code: 'B2' },
    { x: 3, y: 0, color: '#A0826A', label: 'Shed (poultry)', code: 'B3' },
    // Middle row — crops + parlor
    { x: 0, y: 1, color: '#7FA866', label: 'Palak', code: 'A1' },
    { x: 1, y: 1, color: '#D6CCC0', label: 'Parlor', code: 'P' },
    { x: 2, y: 1, color: '#9BC07F', label: 'Millet', code: 'A2' },
    { x: 3, y: 1, color: '#F5C66B', label: 'Forage', code: 'F2' },
    // Front row — more crops + compost
    { x: 0, y: 2, color: '#7FA866', label: 'Palak', code: 'A3' },
    { x: 1, y: 2, color: '#B8D597', label: 'Chillies', code: 'A4' },
    { x: 2, y: 2, color: '#9BC07F', label: 'Greens', code: 'A5' },
    { x: 3, y: 2, color: '#7A5A42', label: 'Compost', code: 'C' },
  ];

  // Iso projection: world (x, y) -> screen (sx, sy)
  const project = (x: number, y: number): [number, number] => {
    const sx = ORIGIN_X + (x - y) * (TILE_W / 2);
    const sy = ORIGIN_Y + (x + y) * (TILE_H / 2);
    return [sx, sy];
  };

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 600 420"
        className="mx-auto w-full max-w-2xl"
        role="img"
        aria-label="Isometric map of the 72-acre farm showing 12 plots and structures"
      >
        <title>Farm layout</title>
        <desc>
          Twelve labeled tiles arranged in a 4x3 isometric grid. Rows from back to front: fodder and
          barns; crop plots and parlor; more crops and compost yard.
        </desc>

        {/* Render tiles back-to-front so closer ones overlap correctly */}
        {tiles.map((t) => {
          const [cx, cy] = project(t.x, t.y);
          const half = TILE_W / 2;
          const halfH = TILE_H / 2;
          // Rhombus (top, right, bottom, left)
          const path = `M${cx},${cy - halfH} L${cx + half},${cy} L${cx},${cy + halfH} L${cx - half},${cy} Z`;
          // Side face (right) for a hint of 3D depth on the tile
          const depth = 8;
          const sidePath = `M${cx + half},${cy} L${cx + half},${cy + depth} L${cx},${cy + halfH + depth} L${cx},${cy + halfH} Z`;
          const frontPath = `M${cx},${cy + halfH} L${cx},${cy + halfH + depth} L${cx - half},${cy + depth} L${cx - half},${cy} Z`;
          return (
            <g key={`${t.x}-${t.y}`}>
              <path d={sidePath} fill={t.color} opacity="0.55" />
              <path d={frontPath} fill={t.color} opacity="0.4" />
              <path d={path} fill={t.color} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
              {t.code ? (
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="10"
                  fontWeight="700"
                  fill="rgba(0,0,0,0.6)"
                >
                  {t.code}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Front-row labels in two columns so they don't collide */}
        <g fontFamily="ui-sans-serif, system-ui" fontSize="11" fill="rgba(0,0,0,0.7)">
          <text x="60" y="310">
            A3 · Palak
          </text>
          <text x="60" y="328">
            A1 · Palak (older)
          </text>
          <text x="60" y="346">
            F1 · Fodder
          </text>
          <text x="420" y="310" textAnchor="end">
            A4 · Chillies
          </text>
          <text x="420" y="328" textAnchor="end">
            A5 · Greens
          </text>
          <text x="420" y="346" textAnchor="end">
            C · Compost yard
          </text>
        </g>
      </svg>
    </div>
  );
}

/* Stylised side-view cow head for the "Who your milk comes from" cards.
   Same colour family as the rest of the page — emerald stroke on cream
   bg — so all five cards read as one set. */
function CowPortrait() {
  return (
    <svg viewBox="0 0 80 80" width="56" height="56" className="text-emerald-900">
      <title>Cow portrait</title>
      {/* Head */}
      <ellipse
        cx="40"
        cy="44"
        rx="22"
        ry="20"
        fill="white"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Horns */}
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
      {/* Snout */}
      <ellipse cx="40" cy="55" rx="11" ry="7" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Nostrils */}
      <ellipse cx="36" cy="55" rx="1" ry="1.5" fill="currentColor" />
      <ellipse cx="44" cy="55" rx="1" ry="1.5" fill="currentColor" />
      {/* Eyes */}
      <circle cx="32" cy="40" r="1.8" fill="currentColor" />
      <circle cx="48" cy="40" r="1.8" fill="currentColor" />
    </svg>
  );
}

/* ---------------------- data ---------------------- */

const COWS = [
  {
    tag: 'GIR-001',
    name: 'Ganga',
    role: 'Foundation cow · the matriarch',
    age: '6 yrs',
    yield: '12 L / day',
  },
  {
    tag: 'GIR-002',
    name: 'Lakshmi',
    role: 'Ganga’s daughter · A2 milk',
    age: '4 yrs',
    yield: '10 L / day',
  },
  {
    tag: 'GIR-003',
    name: 'Nandini',
    role: 'Calved last summer',
    age: '3 yrs',
    yield: '8 L / day',
  },
  {
    tag: 'GIR-004',
    name: 'Parvati',
    role: 'Quiet, steady, regular yielder',
    age: '5 yrs',
    yield: '11 L / day',
  },
  {
    tag: 'GIR-005',
    name: 'Kamala',
    role: 'Newest to the herd',
    age: '2 yrs',
    yield: '7 L / day',
  },
];

const PRACTICES = [
  {
    title: 'PGS-India certified organic',
    body: 'No chemical fertiliser, no synthetic pesticide, no growth promoter. Independently audited under the PGS-India scheme. Certificate available on request.',
    Icon: BadgeCheck,
  },
  {
    title: 'Welfare-first dairy',
    body: 'Every animal has a name, a tag, and access to pasture daily. We log stress-free hours per cow per week — currently 94% — and publish the rolling average on each pack.',
    Icon: Heart,
  },
  {
    title: 'Carbon positive for two years',
    body: 'Compost from the barns + silvopasture on plots A2/A4 has sequestered 2.14 tCO₂e this year, against farm emissions of ~0.8 tCO₂e. Net positive since Q3 2024.',
    Icon: Sprout,
  },
  {
    title: 'Cold-chained door to door',
    body: 'Milk goes from the parlor to a 4 °C tank within 20 minutes. Out of the farm, into an insulated van, into your fridge — never above 6 °C. Per-batch temperature log on the trace page.',
    Icon: Snowflake,
  },
];
