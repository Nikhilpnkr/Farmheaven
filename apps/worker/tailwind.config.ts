import sharedPreset from '@farmheaven/ui/tailwind.preset';
import type { Config } from 'tailwindcss';

export default {
  presets: [sharedPreset],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
} satisfies Config;
