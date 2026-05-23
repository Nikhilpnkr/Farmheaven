import { formatAge } from '@/lib/livestock/format-age';
import { describe, expect, it } from 'vitest';

const NOW = new Date('2026-05-23T12:00:00Z');

describe('formatAge', () => {
  it('returns em-dash for null, undefined, empty string', () => {
    expect(formatAge(null, NOW)).toBe('—');
    expect(formatAge(undefined, NOW)).toBe('—');
    expect(formatAge('', NOW)).toBe('—');
  });

  it('returns em-dash for unparseable dates', () => {
    expect(formatAge('not-a-date', NOW)).toBe('—');
  });

  it('returns em-dash for future dates (DOB cannot be in the future)', () => {
    expect(formatAge('2027-01-01', NOW)).toBe('—');
  });

  it('renders days for under-1-month animals', () => {
    expect(formatAge('2026-05-11', NOW)).toBe('12d');
    expect(formatAge('2026-05-22', NOW)).toBe('1d');
    expect(formatAge('2026-05-23', NOW)).toBe('0d');
  });

  it('renders months for 1m to <1y animals', () => {
    expect(formatAge('2025-09-23', NOW)).toBe('8m');
    expect(formatAge('2026-04-23', NOW)).toBe('1m');
  });

  it('renders years only when month remainder is zero', () => {
    expect(formatAge('2021-05-23', NOW)).toBe('5y');
    expect(formatAge('2025-05-23', NOW)).toBe('1y');
  });

  it('renders years + months remainder when non-zero', () => {
    expect(formatAge('2023-01-23', NOW)).toBe('3y 4m');
    expect(formatAge('2024-08-23', NOW)).toBe('1y 9m');
  });

  it('accepts a Date object as input', () => {
    expect(formatAge(new Date('2024-05-23T00:00:00Z'), NOW)).toBe('2y');
  });
});
