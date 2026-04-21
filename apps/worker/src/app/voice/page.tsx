import { Mic } from 'lucide-react';

export default function VoicePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Mic className="h-14 w-14" />
      </div>
      <h1 className="mt-6 text-xl font-semibold">Record a voice note</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Speak in Telugu, Hindi, or English. We'll transcribe and tag the right animal or plot.
      </p>
      <p className="mt-8 text-xs text-muted-foreground">Phase 7 — ships with Whisper API integration.</p>
    </main>
  );
}
