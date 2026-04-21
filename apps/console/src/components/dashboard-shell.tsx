'use client';

import {
  ClipboardList,
  FileBarChart,
  Leaf,
  LayoutDashboard,
  Milk,
  Package,
  RadioTower,
  Settings,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  Store,
  Users,
  Wallet,
  Wheat,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { Sidebar, type SidebarSection } from '@farmheaven/ui/components/app/sidebar';
import { Topbar } from '@farmheaven/ui/components/app/topbar';
import { KpiCard } from '@farmheaven/ui/components/app/kpi-card';
import { Button } from '@farmheaven/ui/components/ui/button';
import { signOut } from '@/app/login/actions';

interface Props {
  farmId: string;
  user: User;
}

export function DashboardShell({ user }: Props) {
  const [lang, setLang] = useState<'en' | 'te' | 'hi'>('en');

  const sections: SidebarSection[] = [
    {
      title: 'Operate',
      items: [
        { href: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
        { href: '/livestock', label: 'Livestock', icon: <Milk /> },
        { href: '/crops', label: 'Crops & Fields', icon: <Wheat /> },
        { href: '/iot', label: 'IoT & Automation', icon: <RadioTower /> },
        { href: '/inventory', label: 'Inventory', icon: <Package /> },
        { href: '/tasks', label: 'Tasks & People', icon: <ClipboardList /> },
        { href: '/vet', label: 'Vet Workspace', icon: <Stethoscope />, isNew: true },
      ],
    },
    {
      title: 'Sell',
      items: [
        { href: '/orders', label: 'Orders', icon: <ShoppingBag /> },
        { href: '/customers', label: 'Customers', icon: <Users /> },
        { href: '/storefront', label: 'Storefront', icon: <Store /> },
      ],
    },
    {
      title: 'Analyze',
      items: [
        { href: '/finance', label: 'Finance', icon: <Wallet /> },
        { href: '/welfare', label: 'Welfare & Carbon', icon: <Leaf />, isNew: true },
        { href: '/reports', label: 'Reports', icon: <FileBarChart /> },
      ],
    },
    {
      title: 'Field',
      items: [{ href: '/worker', label: 'Worker App', icon: <Smartphone />, isNew: true }],
    },
    {
      title: 'System',
      items: [{ href: '/settings', label: 'Settings', icon: <Settings /> }],
    },
  ];

  return (
    <div className="grid min-h-screen grid-cols-[252px_1fr]">
      <Sidebar
        sections={sections}
        farmSubtitle="Hyderabad · Phase 0"
        footer={
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-turmeric-500 text-sm font-bold text-[#1F1B16]">
              {(user.user_metadata.full_name ?? user.phone ?? 'U').slice(0, 1)}
            </div>
            <div className="flex-1 text-xs leading-tight text-[#D8D0BE]">
              <div>{user.user_metadata.full_name ?? user.phone}</div>
              <div className="text-[#8A8372]">Owner</div>
            </div>
            <form action={signOut}>
              <Button type="submit" size="sm" variant="ghost" className="text-[#D8D0BE]">
                Exit
              </Button>
            </form>
          </div>
        }
      />

      <div className="flex min-w-0 flex-col">
        <Topbar
          lang={lang}
          onLangChange={setLang}
          weather={{ temp: '34°C', label: 'Partly cloudy' }}
          alertCount={1}
        />

        <main className="mx-auto w-full max-w-[1600px] p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Good morning, {user.user_metadata.full_name?.split(' ')[0] ?? 'there'} 🌅
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your farm is set up. Register your first animal to start tracking milk, health, and
              breeding.
            </p>
          </header>

          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Today's milk yield" value="—" unit="L" accent="leaf" auto />
            <KpiCard label="Eggs collected today" value="—" unit="eggs" accent="turmeric" auto />
            <KpiCard label="Tasks (done / open)" value="0/0" accent="soil" />
            <KpiCard label="Revenue this week" value="₹0" accent="indigo" />
          </div>

          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <h2 className="text-xl font-semibold">Phase 0 complete — you're signed in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Next: run Phase 1 to enable the Livestock registry. I'll add animal CRUD, health events,
              breeding, and milk logging.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
