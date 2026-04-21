'use client';

import { cn } from '../../lib/utils';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'te', label: 'తె' },
  { code: 'hi', label: 'हि' },
] as const;

interface LangToggleProps {
  value: 'en' | 'te' | 'hi';
  onChange: (v: 'en' | 'te' | 'hi') => void;
}

export function LangToggle({ value, onChange }: LangToggleProps) {
  return (
    <div className="flex rounded-full border border-border bg-muted p-0.5 text-xs font-semibold">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onChange(lang.code)}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            value === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
