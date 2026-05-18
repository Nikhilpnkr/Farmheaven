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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
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
          className="text-sm text-zinc-400 hover:text-zinc-100"
        >
          Exit admin →
        </Link>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="min-h-[calc(100vh-49px)] w-56 shrink-0 border-r border-zinc-800 bg-zinc-900/50 px-3 py-4">
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
                      className="block rounded px-2 py-1 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
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
