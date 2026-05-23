import { CalendarClock, MapPinned, QrCode, ScanLine, ShieldCheck, Thermometer } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Traceability — from cow to kitchen',
  description:
    'Every FarmHeaven pack has a QR code. Scan it, see which animal or plot the food came from, who handled it, and how cold it stayed. Real provenance, not a sticker.',
};

export default function TraceabilityPage() {
  return (
    <main>
      {/* Hero — same composition family as /meet-the-farm but in the
          amber/turmeric channel to set this page apart visually. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5C66B] via-[#E0A53A] to-[#A56F12] px-6 py-24 text-white">
        <ScannerArt />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-white/80">
            Every pack · every animal · every plot
          </p>
          <h1 className="mt-3 font-brand text-5xl font-bold tracking-tight sm:text-6xl">
            Scan it.
            <br />
            See the story.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/95">
            A QR on every pack. One scan opens a page that tells you which animal your milk came
            from, which plot grew your spinach, how cold the truck was, and who handled it on the
            way to you.
          </p>
          <div className="mt-8">
            <Link
              href="/trace/A2-MILK-2026-05-23-001"
              className="inline-flex h-11 items-center rounded-lg bg-white px-6 font-semibold text-amber-800 shadow-elev-2 transition-transform motion-safe:hover:-translate-y-0.5"
            >
              See a sample trace page →
            </Link>
          </div>
        </div>
      </section>

      {/* Three steps — animated icon trio with a connecting line */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-2 font-brand text-3xl font-bold">Three steps from doubt to trust.</h2>
        </div>

        <ol className="relative grid gap-10 sm:grid-cols-3">
          {/* Connecting line, only visible from sm: up */}
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent sm:block"
          />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-elev-2">
                <s.Icon aria-hidden className="size-7" />
              </div>
              <div className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </div>
              <h3 className="mt-2 font-brand text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* What you actually see — a stylised preview card of a trace page */}
      <section className="border-y border-border bg-card py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 grid items-end gap-4 sm:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                The trace page
              </p>
              <h2 className="mt-2 font-brand text-3xl font-bold">What you actually see.</h2>
              <p className="mt-3 text-base text-muted-foreground">
                Not a feel-good badge. A timestamped log of where the food has been, who handled it,
                and which conditions it was in.
              </p>
            </div>
            <Link
              href="/trace/A2-MILK-2026-05-23-001"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-transform motion-safe:hover:-translate-y-0.5"
            >
              Open a sample →
            </Link>
          </div>

          <TracePreviewCard />
        </div>
      </section>

      {/* Why this is hard to fake */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          The honest part
        </p>
        <h2 className="mt-2 font-brand text-3xl font-bold">Why this is hard to fake.</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/90">
          <p>
            Most "organic" or "farm-fresh" labels are claims. Nothing on the pack tells you which
            animal, which day, which plot — because there's usually no answer to give. The supply
            chain washes the information out.
          </p>
          <p>
            We log every event on the farm against the animal or plot it relates to: milking time,
            feed batch, vet visit, harvest, temperature, pack, dispatch, delivery. The QR doesn't
            generate trust — the underlying log does. The QR is just how you read it.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#4E7038] to-[#2F4D24] p-10 text-white sm:p-14">
          <h2 className="font-brand text-3xl font-bold sm:text-4xl">Order a pack. Scan the QR.</h2>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Quickest way to see the system work is to receive a pack and try it yourself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-lg bg-white px-6 font-semibold text-leaf-700 shadow-elev-2 transition-transform motion-safe:hover:-translate-y-0.5"
            >
              See the catalogue
            </Link>
            <Link
              href="/meet-the-farm"
              className="inline-flex h-11 items-center rounded-lg border border-white/30 bg-white/10 px-6 font-semibold backdrop-blur transition-colors hover:bg-white/20"
            >
              Meet the farm first
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Decorative scanner-frame SVG for the hero. A QR-corner motif rendered
   four times rotated, with a scan-line that drifts vertically. Motion
   gated to motion-safe. */
function ScannerArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-6 top-10 w-44 opacity-60 sm:right-16 sm:w-56"
    >
      <svg viewBox="0 0 200 200" className="w-full">
        <title>QR scanner frame</title>
        {/* Four L-shaped corners */}
        {[
          { x: 20, y: 20, r: 0 },
          { x: 180, y: 20, r: 90 },
          { x: 180, y: 180, r: 180 },
          { x: 20, y: 180, r: -90 },
        ].map((c) => (
          <g key={`${c.x}-${c.y}`} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
            <path
              d="M0 30 L0 0 L30 0"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ))}
        {/* Scan line — animated vertical drift inside the frame */}
        <line
          x1="30"
          y1="100"
          x2="170"
          y2="100"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
          className="motion-safe:[animation:scan_3.2s_ease-in-out_infinite]"
        />
        <style>
          {`@keyframes scan {
              0%, 100% { transform: translateY(-60px); opacity: 0.2; }
              50% { transform: translateY(60px); opacity: 0.9; }
            }`}
        </style>
      </svg>
    </div>
  );
}

/* Stylised preview of an actual /trace/[slug] page. Not a real
   screenshot — a SVG-like card that conveys the structure and detail
   level without committing to specific pixel-perfect mirroring. */
function TracePreviewCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elev-2">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate font-mono text-xs text-muted-foreground">
          farmheaven.in/trace/A2-MILK-2026-05-23-001
        </span>
      </div>

      {/* Page header */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              A2 Gir cow milk · 1 L · Batch A2M-053
            </p>
            <h3 className="mt-2 font-brand text-2xl font-bold">
              From Ganga, milked May 23 at 5:42 AM
            </h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
            <ShieldCheck aria-hidden className="size-4" />
            Verified
          </span>
        </div>

        {/* Mini timeline (decorative) */}
        <ol className="mt-8 space-y-4 text-sm">
          {PREVIEW_STEPS.map((s) => (
            <li key={s.label} className="flex items-start gap-3">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <s.Icon aria-hidden className="size-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold">
                  {s.label}
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{s.when}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">{s.detail}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ----------------------- data ----------------------- */

const STEPS = [
  {
    title: 'Scan',
    body: 'Every pack ships with a unique QR code. Point any phone camera at it — no app to install, no account to make.',
    Icon: ScanLine,
  },
  {
    title: 'See',
    body: 'A page opens with the source animal or plot, the timeline (milking / pack / dispatch / delivery), and the cold-chain log.',
    Icon: QrCode,
  },
  {
    title: 'Decide',
    body: "If anything looks off — a temperature spike, a missing audit, a pack handler we don't recognise — the page tells you. No buried disclaimers.",
    Icon: ShieldCheck,
  },
];

const PREVIEW_STEPS = [
  {
    label: 'Milked',
    when: '05:42 AM · May 23',
    detail: 'Ganga (GIR-001) · parlor stall 2 · operator Rajesh',
    Icon: CalendarClock,
  },
  {
    label: 'Chilled to 4 °C',
    when: '06:01 AM',
    detail: 'In-line chiller · log temperature 3.8 °C',
    Icon: Thermometer,
  },
  {
    label: 'Packed',
    when: '06:34 AM',
    detail: 'Bottle line 1 · batch A2M-053 · pasteurised: no',
    Icon: QrCode,
  },
  {
    label: 'Dispatched',
    when: '07:10 AM',
    detail: 'Van TS-09-AB-1842 · cold tank 4.6 °C · driver Kiran',
    Icon: MapPinned,
  },
];
