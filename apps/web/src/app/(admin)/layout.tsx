import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { assertSuperAdmin } from './admin/_lib/admin-client';
import { ADMIN_GROUPS } from './admin/_lib/table-list';
import { Separator } from '@farmheaven/ui/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders with the middleware gate. If middleware ever has a bug,
  // this still refuses unauthenticated/non-admin requests.
  await assertSuperAdmin();

  return (
    // Hard-coded dark palette: admin should look distinctly different
    // regardless of the user's theme preference (intentional override).
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Topbar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <span className="font-mono text-sm uppercase tracking-wider text-amber-400">
            Admin · super_admin only
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Exit admin →
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-900/50 px-3 py-4">
          {ADMIN_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <div className="mb-1 px-2 text-[10px] uppercase tracking-wider text-zinc-500">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.tables.map((t) => (
                  <li key={t.name}>
                    <Link
                      href={`/admin/${t.name}`}
                      className="block rounded px-2 py-1 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Separator className="my-3 bg-zinc-800" />
            </div>
          ))}
        </nav>

        {/* Main */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
