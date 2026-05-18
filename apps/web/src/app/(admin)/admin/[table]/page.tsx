import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@farmheaven/ui/components/ui/table';
import { Button } from '@farmheaven/ui/components/ui/button';
import { assertSuperAdmin, createAdminClient } from '../_lib/admin-client';
import { findTable } from '../_lib/table-list';

export const dynamic = 'force-dynamic';

const PAGE_SIZE_DEFAULT = 50;
const COUNT_CAP = 10_000;

type Search = {
  page?: string;
  size?: string;
  order?: string;
  dir?: string;
};

export default async function TableListPage({
  params,
  searchParams,
}: {
  params: Promise<{ table: string }>;
  searchParams: Promise<Search>;
}) {
  await assertSuperAdmin();

  const { table } = await params;
  const sp = await searchParams;

  const config = findTable(table);
  if (!config) notFound();

  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  const size = Math.min(200, Math.max(1, parseInt(sp.size ?? String(PAGE_SIZE_DEFAULT), 10) || PAGE_SIZE_DEFAULT));
  const order = sp.order && config.listColumns.includes(sp.order) ? sp.order : 'created_at';
  const dir: 'asc' | 'desc' = sp.dir === 'asc' ? 'asc' : 'desc';

  const admin = createAdminClient();
  const offset = (page - 1) * size;

  // Build the query. We try the requested order first; if the column doesn't
  // exist (e.g. species has no created_at), retry with primary-key order.
  //
  // Two casts here:
  //   1. `table as any` — .from() expects a literal-union of allowlisted
  //      table names; ours is a runtime string vetted by findTable().
  //   2. `... as any` on the builder — sidesteps the supabase-js 2.105.x
  //      "Type instantiation is excessively deep" defect that also bit
  //      Tasks 2 and 4. The query works fine at runtime.
  let rowsResult = await (admin.from(table as any) as any)
    .select('*', { count: 'estimated' })
    .order(order, { ascending: dir === 'asc' })
    .range(offset, offset + size - 1);

  if (rowsResult.error && /column .* does not exist/i.test(rowsResult.error.message)) {
    rowsResult = await (admin.from(table as any) as any)
      .select('*', { count: 'estimated' })
      .order('id', { ascending: dir === 'asc' })
      .range(offset, offset + size - 1);
  }

  if (rowsResult.error) {
    return (
      <div>
        <h1 className="font-mono text-2xl">{config.label}</h1>
        <pre className="mt-4 rounded bg-red-950/40 p-4 text-sm text-red-300">
          {rowsResult.error.message}
        </pre>
      </div>
    );
  }

  const rows = (rowsResult.data ?? []) as Record<string, unknown>[];
  const rawCount = rowsResult.count ?? 0;
  const countLabel = rawCount > COUNT_CAP ? `${COUNT_CAP.toLocaleString()}+ rows` : `${rawCount.toLocaleString()} rows`;
  const totalPages = Math.max(1, Math.ceil(Math.min(rawCount, COUNT_CAP) / size));

  return (
    <div>
      <header className="mb-4 flex items-baseline justify-between">
        <h1 className="font-mono text-2xl">{config.label}</h1>
        <span className="text-sm text-zinc-400">{countLabel}</span>
      </header>

      <div className="overflow-x-auto rounded border border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              {config.listColumns.map((col) => (
                <TableHead key={col} className="font-mono text-xs text-zinc-400">
                  <Link
                    href={{
                      pathname: `/admin/${table}`,
                      query: { page: '1', size, order: col, dir: order === col && dir === 'asc' ? 'desc' : 'asc' },
                    }}
                    className="hover:text-zinc-100"
                  >
                    {col}
                    {order === col ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
                  </Link>
                </TableHead>
              ))}
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => {
              const id = String(row['id'] ?? row['code'] ?? i);
              return (
                <TableRow key={id} className="border-zinc-800 hover:bg-zinc-900/50">
                  {config.listColumns.map((col) => (
                    <TableCell key={col} className="max-w-xs truncate font-mono text-xs" title={formatCell(row[col])}>
                      {formatCell(row[col])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost" className="text-amber-400 hover:bg-zinc-800 hover:text-amber-300">
                      <Link href={`/admin/${table}/${id}`}>edit →</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <nav className="mt-4 flex items-center justify-between text-sm text-zinc-400">
        {page > 1 ? (
          <Button asChild size="sm" variant="ghost">
            <Link href={{ pathname: `/admin/${table}`, query: { page: String(page - 1), size, order, dir } }}>
              ‹‹ Prev
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="ghost" disabled>
            ‹‹ Prev
          </Button>
        )}
        <span>
          page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <Button asChild size="sm" variant="ghost">
            <Link href={{ pathname: `/admin/${table}`, query: { page: String(page + 1), size, order, dir } }}>
              Next ››
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="ghost" disabled>
            Next ››
          </Button>
        )}
      </nav>
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}
