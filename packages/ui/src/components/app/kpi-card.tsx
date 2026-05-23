import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  delta?: { value: string; direction: 'up' | 'down' | 'neutral' };
  auto?: boolean;
  isNew?: boolean;
  accent?: 'leaf' | 'turmeric' | 'soil' | 'indigo';
  children?: React.ReactNode;
}

const accentBar = {
  leaf: 'before:bg-gradient-to-r before:from-leaf-500 before:to-leaf-600',
  turmeric: 'before:bg-gradient-to-r before:from-turmeric-500 before:to-[#b8820a]',
  soil: 'before:bg-gradient-to-r before:from-soil-500 before:to-soil-700',
  indigo: 'before:bg-gradient-to-r before:from-[#3B4CA0] before:to-[#1f2a6a]',
};

export function KpiCard({
  label,
  value,
  unit,
  delta,
  auto,
  isNew,
  accent = 'leaf',
  children,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-[18px] shadow-elev-1',
        'before:absolute before:inset-x-0 before:bottom-0 before:h-[3px] before:content-[""]',
        accentBar[accent],
      )}
    >
      {auto ? (
        <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full bg-leaf-50 px-2 py-0.5 text-[10px] font-semibold text-leaf-600">
          AUTO
        </div>
      ) : null}
      {isNew ? (
        <div className="absolute right-3.5 top-3.5 rounded-full bg-turmeric-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1F1B16]">
          NEW
        </div>
      ) : null}
      <div className="mb-0.5 text-[12.5px] text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold leading-none tracking-tight">{value}</span>
        {unit ? (
          <span className="text-[13px] font-medium text-muted-foreground">{unit}</span>
        ) : null}
      </div>
      {delta ? (
        <span
          className={cn(
            'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
            delta.direction === 'up' && 'bg-leaf-50 text-success',
            delta.direction === 'down' && 'bg-red-50 text-destructive',
            delta.direction === 'neutral' && 'bg-muted text-muted-foreground',
          )}
        >
          {delta.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : null}
          {delta.direction === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
          {delta.value}
        </span>
      ) : null}
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}
