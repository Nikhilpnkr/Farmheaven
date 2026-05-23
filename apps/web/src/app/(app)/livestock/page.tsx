import { formatAge } from '@/lib/livestock/format-age';
import {
  getCurrentFarmIdFromMembership,
  listAnimals,
  listBreedsForForm,
  listSpeciesForForm,
  listStructuresForFarm,
} from '@/lib/livestock/queries';
import { SEX_LABELS } from '@/lib/livestock/schemas';
import type { Database } from '@farmheaven/db';
import { createClient } from '@farmheaven/db/server';
import { Button } from '@farmheaven/ui/components/ui/button';
import { Input } from '@farmheaven/ui/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@farmheaven/ui/components/ui/table';
import type { SupabaseClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RegisterAnimalSheet } from './_components/register-animal-sheet';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

type Search = {
  page?: string;
  q?: string;
  species?: string;
  retired?: string;
  order?: string;
  dir?: string;
};

export default async function LivestockPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // supabase-js 2.105.x: @supabase/ssr's createServerClient returns the
  // 3-generic SupabaseClient shape, while query helpers declare the
  // 4-generic form. Same family of type-skew handled in actions.ts.
  const db = supabase as never as SupabaseClient<Database>;

  const farmId = await getCurrentFarmIdFromMembership(db, user.id);
  if (!farmId) redirect('/onboarding');

  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1);
  const search = (sp.q ?? '').trim();
  const speciesFilter = sp.species && sp.species !== 'all' ? sp.species : undefined;
  const includeRetired = sp.retired === '1';
  const order = sp.order === 'date_of_birth' ? 'date_of_birth' : 'tag';
  const dir: 'asc' | 'desc' = sp.dir === 'desc' ? 'desc' : 'asc';

  const [{ rows, totalCount }, species, breeds, structures] = await Promise.all([
    listAnimals(db, {
      farmId,
      page,
      size: PAGE_SIZE,
      search,
      species: speciesFilter,
      includeRetired,
      order,
      dir,
    }),
    listSpeciesForForm(db),
    listBreedsForForm(db),
    listStructuresForFarm(db, farmId),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasFilters = Boolean(search || speciesFilter || includeRetired);

  function buildQuery(overrides: Record<string, string | undefined>): Record<string, string> {
    const merged: Record<string, string | undefined> = {
      q: search || undefined,
      species: speciesFilter,
      retired: includeRetired ? '1' : undefined,
      order: order === 'tag' ? undefined : order,
      dir: dir === 'asc' ? undefined : dir,
      page: page === 1 ? undefined : String(page),
      ...overrides,
    };
    return Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== undefined)) as Record<
      string,
      string
    >;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-6">
      <header className="mb-4 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Livestock</h1>
          <p className="text-sm text-muted-foreground">
            {totalCount === 0
              ? 'No animals yet'
              : `${totalCount.toLocaleString()} ${totalCount === 1 ? 'animal' : 'animals'}`}
          </p>
        </div>
        <RegisterAnimalSheet species={species} breeds={breeds} structures={structures} />
      </header>

      {/* Search + retired toggle */}
      <form className="mb-3 flex items-center gap-3" action="/livestock" method="get">
        <Input
          name="q"
          defaultValue={search}
          placeholder="Search tag or name…"
          className="max-w-xs"
        />
        {speciesFilter && <input type="hidden" name="species" value={speciesFilter} />}
        <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <input type="checkbox" name="retired" value="1" defaultChecked={includeRetired} />
          Show retired
        </label>
        <Button type="submit" size="sm" variant="secondary">
          Apply
        </Button>
      </form>

      {/* Species pills */}
      <nav className="mb-4 flex flex-wrap gap-1.5">
        <PillLink
          href={{
            pathname: '/livestock',
            query: buildQuery({ species: undefined, page: undefined }),
          }}
          active={!speciesFilter}
        >
          All
        </PillLink>
        {species.map((s) => (
          <PillLink
            key={s.code}
            href={{
              pathname: '/livestock',
              query: buildQuery({ species: s.code, page: undefined }),
            }}
            active={speciesFilter === s.code}
          >
            {s.label}
          </PillLink>
        ))}
      </nav>

      {/* Table or empty state */}
      {rows.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="overflow-x-auto rounded border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <SortLink current={order === 'tag'} dir={dir} buildQuery={buildQuery} col="tag">
                    Tag
                  </SortLink>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>
                  <SortLink
                    current={order === 'date_of_birth'}
                    dir={dir}
                    buildQuery={buildQuery}
                    col="date_of_birth"
                  >
                    Age
                  </SortLink>
                </TableHead>
                <TableHead>Structure</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.tag}</TableCell>
                  <TableCell>{row.name ?? '—'}</TableCell>
                  <TableCell>
                    {row.species_label}
                    {row.breed_label ? (
                      <span className="text-muted-foreground"> · {row.breed_label}</span>
                    ) : null}
                  </TableCell>
                  <TableCell>{SEX_LABELS[row.sex]}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {formatAge(row.date_of_birth)}
                  </TableCell>
                  <TableCell>{row.structure_name ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/livestock/${row.id}`}>open →</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {rows.length > 0 && (
        <nav className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          {page > 1 ? (
            <Button asChild size="sm" variant="ghost">
              <Link
                href={{ pathname: '/livestock', query: buildQuery({ page: String(page - 1) }) }}
              >
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
              <Link
                href={{ pathname: '/livestock', query: buildQuery({ page: String(page + 1) }) }}
              >
                Next ››
              </Link>
            </Button>
          ) : (
            <Button size="sm" variant="ghost" disabled>
              Next ››
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}

function PillLink({
  href,
  active,
  children,
}: {
  href: { pathname: string; query: Record<string, string> };
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground'
          : 'rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted'
      }
    >
      {children}
    </Link>
  );
}

function SortLink({
  current,
  dir,
  buildQuery,
  col,
  children,
}: {
  current: boolean;
  dir: 'asc' | 'desc';
  buildQuery: (o: Record<string, string | undefined>) => Record<string, string>;
  col: 'tag' | 'date_of_birth';
  children: React.ReactNode;
}) {
  const nextDir = current && dir === 'asc' ? 'desc' : 'asc';
  return (
    <Link
      href={{
        pathname: '/livestock',
        query: buildQuery({ order: col, dir: nextDir, page: undefined }),
      }}
      className="text-xs text-muted-foreground hover:text-foreground"
    >
      {children}
      {current ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
    </Link>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">No animals match these filters.</p>
        <Button asChild size="sm" variant="link" className="mt-2">
          <Link href="/livestock">Clear filters</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-xl font-semibold">No animals yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Register your first animal to start tracking milk, health, and breeding.
      </p>
    </div>
  );
}
