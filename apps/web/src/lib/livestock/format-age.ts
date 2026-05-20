import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

// Format an animal's age relative to today.
// Returns:
//   '—'        if dob is null/undefined/empty
//   '12d'      if under 1 month
//   '8m'       if under 1 year
//   '3y 4m'    if 1 year or older (months remainder only when > 0)
//   '5y'       if 1+ years and zero months remainder
export function formatAge(dob: string | Date | null | undefined, now: Date = new Date()): string {
  if (dob === null || dob === undefined || dob === '') return '—';

  const birth = typeof dob === 'string' ? new Date(`${dob}T00:00:00`) : dob;
  if (Number.isNaN(birth.getTime())) return '—';
  if (birth > now) return '—';

  const years = differenceInYears(now, birth);
  if (years >= 1) {
    // months remainder past the year mark
    const monthsTotal = differenceInMonths(now, birth);
    const months = monthsTotal - years * 12;
    return months > 0 ? `${years}y ${months}m` : `${years}y`;
  }

  const months = differenceInMonths(now, birth);
  if (months >= 1) return `${months}m`;

  const days = differenceInDays(now, birth);
  return `${days}d`;
}
