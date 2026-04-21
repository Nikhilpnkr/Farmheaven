import { Camera, CheckCircle2, ListTodo, MapPin, Mic, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function WorkerHome() {
  return (
    <main className="flex min-h-screen flex-col pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-leaf-600 to-leaf-500 px-5 pb-5 pt-[max(env(safe-area-inset-top),1rem)] text-white">
        <div className="text-xs opacity-85">ఈ రోజు</div>
        <div className="mt-0.5 text-xl font-bold">5 tasks · Mon 20 Apr</div>
      </header>

      {/* Task list */}
      <div className="flex-1 space-y-3 p-4">
        {TASKS.map((task) => (
          <article
            key={task.id}
            className="rounded-xl border border-border bg-card p-3 shadow-elev-1"
            style={{ borderLeft: `4px solid ${task.color}` }}
          >
            <div className="text-xs text-muted-foreground">{task.when}</div>
            <div className="mt-1 text-base font-semibold">{task.title}</div>
            <div className="mt-0.5 text-sm text-muted-foreground">{task.sub}</div>
            <button
              type="button"
              className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground"
            >
              Start
            </button>
          </article>
        ))}

        {/* Geo check-in */}
        <div className="rounded-xl border border-dashed border-leaf-600 bg-leaf-50 p-4 text-center">
          <MapPin className="mx-auto h-5 w-5 text-leaf-600" />
          <div className="mt-1.5 text-sm font-semibold">Gate check-in ✓</div>
          <div className="text-xs text-muted-foreground">6:08 AM · within geofence</div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-border bg-card px-2 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <TabLink href="/" label="Tasks" icon={<ListTodo className="h-5 w-5" />} active />
        <TabLink href="/voice" label="Voice" icon={<Mic className="h-5 w-5" />} />
        <TabLink href="/photo" label="Photo" icon={<Camera className="h-5 w-5" />} />
        <TabLink href="/pay" label="Pay" icon={<Wallet className="h-5 w-5" />} />
      </nav>
    </main>
  );
}

function TabLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

const TASKS = [
  {
    id: '1',
    when: '6:30 AM · పొలం 3',
    title: 'Palak కోత · 45 kg',
    sub: '+ 2 మంది · 3 PM కు dispatch',
    color: '#C62828',
  },
  {
    id: '2',
    when: '10:00 AM · Plot 4',
    title: 'Drip lines check',
    sub: 'Zone 4 watering ends 10:30',
    color: '#E0A415',
  },
  {
    id: '3',
    when: '✓ 6:12 AM · పార్ల‌ర్ 1',
    title: 'Morning milking',
    sub: '241 L · auto-logged',
    color: '#4E9E54',
  },
];
