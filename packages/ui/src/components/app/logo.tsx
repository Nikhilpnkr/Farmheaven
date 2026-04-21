import { Sprout } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  sub?: string;
}

export function Logo({ className, sub }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-leaf-500 to-leaf-600 text-white shadow-elev-2 ring-2 ring-white/10">
        <Sprout className="h-5 w-5" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-brand text-[17px] font-bold">FarmHeaven</span>
        {sub ? <span className="text-[11px] text-muted-foreground">{sub}</span> : null}
      </div>
    </div>
  );
}
