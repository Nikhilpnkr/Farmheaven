'use client';

import { Bell, LifeBuoy, MessageCircle, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LangToggle } from './lang-toggle';

interface TopbarProps {
  lang: 'en' | 'te' | 'hi';
  onLangChange: (v: 'en' | 'te' | 'hi') => void;
  weather?: { temp: string; label: string };
  alertCount?: number;
  className?: string;
}

export function Topbar({ lang, onLangChange, weather, alertCount, className }: TopbarProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card px-6 py-2.5',
        className,
      )}
    >
      <div className="flex max-w-[480px] flex-1 items-center gap-2 rounded-[10px] border border-border bg-muted px-3 py-2 text-muted-foreground">
        <Search className="h-4 w-4" />
        <input
          className="flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Search animals, fields, SKUs, orders..."
        />
        <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <LangToggle value={lang} onChange={onLangChange} />

      {weather ? (
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 text-sm">
          <div className="relative h-5 w-5 overflow-hidden rounded-full bg-gradient-to-br from-turmeric-500 to-[#F4C14A]" />
          <strong>{weather.temp}</strong>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{weather.label}</span>
        </div>
      ) : null}

      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted"
      >
        <Bell className="h-4 w-4" />
        {alertCount ? (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border-2 border-card bg-destructive" />
        ) : null}
      </button>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted"
      >
        <MessageCircle className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted"
      >
        <LifeBuoy className="h-4 w-4" />
      </button>
    </div>
  );
}
