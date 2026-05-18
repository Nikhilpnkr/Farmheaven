import Link from 'next/link';
import { notFound } from 'next/navigation';
import { assertSuperAdmin, createAdminClient } from '../../_lib/admin-client';
import { findTable } from '../../_lib/table-list';
import { EditJsonModal } from './edit-json-modal';
import { DeleteButton } from './delete-button';

export const dynamic = 'force-dynamic';

export default async function RowDetailPage({
  params,
}: {
  params: Promise<{ table: string; id: string }>;
}) {
  await assertSuperAdmin();
  const { table, id } = await params;

  const config = findTable(table);
  if (!config) notFound();

  const pk = pkColumn(table);
  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: row, error } = await (admin.from(table as any) as any)
    .select('*')
    .eq(pk, id)
    .maybeSingle();

  if (error || !row) {
    return (
      <div>
        <Link href={`/admin/${table}`} className="text-amber-400 hover:underline">
          ← {config.label}
        </Link>
        <pre className="mt-4 rounded bg-red-950/40 p-4 text-sm text-red-300">
          {error?.message ?? `Row ${id} not found.`}
        </pre>
      </div>
    );
  }

  // We freeze the JSON for the modal pre-fill server-side so the client
  // component always edits the exact row the server just read.
  const rowJsonString = JSON.stringify(row, null, 2);

  return (
    <div>
      <Link href={`/admin/${table}`} className="text-amber-400 hover:underline">
        ← {config.label}
      </Link>

      <header className="mt-2 flex items-baseline justify-between">
        <h1 className="font-mono text-2xl">
          {config.label} · <span className="text-zinc-400">{id}</span>
        </h1>
        <div className="flex gap-2">
          <EditJsonModal table={table} id={id} initialJson={rowJsonString} pkColumn={pk} />
          <DeleteButton table={table} id={id} pkColumn={pk} />
        </div>
      </header>

      <section className="mt-6 rounded border border-zinc-800 bg-zinc-900/40">
        <h2 className="border-b border-zinc-800 px-4 py-2 text-xs uppercase tracking-wider text-zinc-500">
          Row data
        </h2>
        <dl className="divide-y divide-zinc-800">
          {Object.entries(row as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="flex px-4 py-2 text-sm">
              <dt className="w-48 shrink-0 font-mono text-xs text-zinc-500">{k}</dt>
              <dd className="break-all font-mono text-xs text-zinc-200">{formatValue(v)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

// Tables that key on a non-'id' column. Add to the map if you discover more.
// Only species uses 'code' as PK in this schema. breeds/crops/certification_bodies
// have a 'code' column too but their PK is still 'id'.
const PK_BY_TABLE: Record<string, string> = {
  species: 'code',
};

function pkColumn(table: string): string {
  return PK_BY_TABLE[table] ?? 'id';
}

function formatValue(v: unknown): React.ReactNode {
  if (v === null || v === undefined) return <span className="text-zinc-600">null</span>;
  if (typeof v === 'object') {
    return <pre className="whitespace-pre-wrap">{JSON.stringify(v, null, 2)}</pre>;
  }
  return String(v);
}
