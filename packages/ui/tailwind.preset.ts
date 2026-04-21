// Shared Tailwind preset — every app extends this.
// Matches the design tokens in design-system.md §4 and the prototype.

import type { Config } from 'tailwindcss';

const preset = {
  darkMode: ['class'],
  content: [],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans Telugu', 'system-ui', 'sans-serif'],
        brand: ['Fraunces', 'Noto Serif Telugu', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // shadcn-style semantic tokens (mapped from our CSS custom properties)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // FarmHeaven brand tokens
        leaf: {
          50: '#EAF3EB',
          500: '#4E9E54',
          600: '#3B7A3F',
        },
        soil: {
          50: '#F5EEE4',
          500: '#8B6A4A',
          700: '#5B3A1E',
        },
        turmeric: {
          50: '#FDF4DC',
          500: '#E0A415',
        },
        // Semantic
        success: '#2E7D32',
        warning: '#E59400',
        danger: '#C62828',
        info: '#1565C0',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'elev-1': '0 1px 2px rgba(68,52,36,0.06)',
        'elev-2': '0 2px 4px rgba(68,52,36,0.08), 0 1px 2px rgba(68,52,36,0.04)',
        'elev-3': '0 8px 16px rgba(68,52,36,0.10), 0 2px 4px rgba(68,52,36,0.06)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-ring': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(78,158,84,.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(78,158,84,0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up': 'accordion-up 200ms ease-out',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;

export default preset;
