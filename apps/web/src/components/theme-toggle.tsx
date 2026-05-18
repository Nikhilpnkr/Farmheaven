'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — the resolved theme isn't known on the server.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {/* Render a neutral icon pre-mount; swap after we know the theme.
          suppressHydrationWarning is a no-op here because mounted gates the swap. */}
      <Sun className={`h-4 w-4 transition-all ${mounted && isDark ? 'hidden' : 'block'}`} />
      <Moon className={`h-4 w-4 transition-all ${mounted && isDark ? 'block' : 'hidden'}`} />
    </button>
  );
}
