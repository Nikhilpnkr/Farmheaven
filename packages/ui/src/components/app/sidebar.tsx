'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { Logo } from './logo';

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  isNew?: boolean;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  farmName?: string;
  farmSubtitle?: string;
  footer?: React.ReactNode;
}

export function Sidebar({ sections, farmName, farmSubtitle, footer }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[252px] flex-col overflow-y-auto bg-gradient-to-b from-[#1F1B16] to-[#2B241C] px-3 py-4 text-[#EFE8D7]">
      <div className="mb-2 border-b border-white/10 pb-4">
        <Logo sub={farmSubtitle ?? farmName} />
      </div>

      <nav className="flex-1 space-y-1">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#8A8372]">
              {section.title}
            </div>
            {section.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all',
                    active
                      ? 'bg-gradient-to-r from-leaf-500/25 to-leaf-500/5 text-white shadow-[inset_2px_0_0_theme(colors.leaf.500)]'
                      : 'text-[#D8D0BE] hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span className="[&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold">
                      {item.badge}
                    </span>
                  ) : null}
                  {item.isNew ? (
                    <span className="rounded-full bg-turmeric-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1F1B16]">
                      NEW
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {footer ? (
        <div className="sticky bottom-0 -mx-3 -mb-4 mt-4 border-t border-white/10 bg-gradient-to-t from-[#1F1B16] to-transparent px-3 pb-3 pt-3">
          {footer}
        </div>
      ) : null}
    </aside>
  );
}
