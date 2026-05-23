import { formatAge } from '@/lib/livestock/format-age';
import { getAnimal } from '@/lib/livestock/queries';
import { ACQUISITION_KIND_LABELS, SEX_LABELS } from '@/lib/livestock/schemas';
import type { Database } from '@farmheaven/db';
import { createClient } from '@farmheaven/db/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // supabase-js 2.105.x: @supabase/ssr's createServerClient returns the
  // 3-generic SupabaseClient shape, while query helpers declare the
  // 4-generic form. Same family of type-skew handled in actions.ts and
  // the list page.
  const db = supabase as never as SupabaseClient<Database>;

  const { id } = await params;
  const animal = await getAnimal(db, id);
  if (!animal) notFound();

  const age = formatAge(animal.date_of_birth);
  const headline = animal.name || animal.tag;
  const summary = [
    animal.breed_label ? `${animal.species_label} (${animal.breed_label})` : animal.species_label,
    SEX_LABELS[animal.sex],
    age !== '—' ? age : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <Link href="/livestock" className="text-sm text-muted-foreground hover:underline">
        ← Livestock
      </Link>

      <header className="mt-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {headline}
          {animal.name ? (
            <span className="ml-2 font-mono text-base text-muted-foreground">· {animal.tag}</span>
          ) : null}
        </h1>
        {summary && <p className="mt-1 text-sm text-muted-foreground">{summary}</p>}
      </header>

      <Section title="Basics">
        <Row label="Tag" value={animal.tag} mono />
        <Row label="Name" value={animal.name ?? '—'} />
        <Row
          label="Species"
          value={
            animal.breed_label
              ? `${animal.species_label} (${animal.breed_label})`
              : animal.species_label
          }
        />
        <Row label="Sex" value={SEX_LABELS[animal.sex]} />
        <Row
          label="Date of birth"
          value={animal.date_of_birth ? `${animal.date_of_birth}  (${age})` : '—'}
        />
        <Row label="Health state" value={animal.health_state} />
        <Row label="Lifecycle" value={animal.lifecycle ?? '—'} />
        {animal.rfid_tag && <Row label="RFID tag" value={animal.rfid_tag} mono />}
        {animal.retired_at && <Row label="Retired at" value={animal.retired_at} />}
      </Section>

      <Section title="Location & parentage">
        <Row label="Structure" value={animal.structure_name ?? '—'} />
        <Row
          label="Dam"
          value={
            animal.dam ? (
              <Link href={`/livestock/${animal.dam.id}`} className="text-primary hover:underline">
                {animal.dam.name || animal.dam.tag}
                {animal.dam.name ? (
                  <span className="ml-1 font-mono text-xs text-muted-foreground">
                    · {animal.dam.tag}
                  </span>
                ) : null}
              </Link>
            ) : (
              '—'
            )
          }
        />
        <Row
          label="Sire"
          value={
            animal.sire ? (
              <Link href={`/livestock/${animal.sire.id}`} className="text-primary hover:underline">
                {animal.sire.name || animal.sire.tag}
                {animal.sire.name ? (
                  <span className="ml-1 font-mono text-xs text-muted-foreground">
                    · {animal.sire.tag}
                  </span>
                ) : null}
              </Link>
            ) : (
              '—'
            )
          }
        />
      </Section>

      <Section title="Acquisition">
        <Row
          label="Kind"
          value={
            animal.acquisition_kind
              ? (ACQUISITION_KIND_LABELS[
                  animal.acquisition_kind as keyof typeof ACQUISITION_KIND_LABELS
                ] ?? animal.acquisition_kind)
              : '—'
          }
        />
        <Row label="Date" value={animal.acquired_at ?? '—'} />
        <Row
          label="Cost"
          value={
            animal.acquisition_cost !== null ? `₹${animal.acquisition_cost.toLocaleString()}` : '—'
          }
        />
        <Row label="Source" value={animal.acquisition_source ?? '—'} />
      </Section>

      <Section title="System">
        <Row
          label="Created"
          value={
            animal.created_by_name
              ? `${formatTimestamp(animal.created_at)} by ${animal.created_by_name}`
              : formatTimestamp(animal.created_at)
          }
        />
        <Row
          label="Updated"
          value={animal.updated_at === animal.created_at ? '—' : formatTimestamp(animal.updated_at)}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-lg border border-border bg-card">
      <h2 className="border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <dl className="divide-y divide-border">{children}</dl>
    </section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex px-4 py-2 text-sm">
      <dt className="w-40 shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono text-xs' : 'text-sm'}>{value}</dd>
    </div>
  );
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toISOString().slice(0, 10);
}
