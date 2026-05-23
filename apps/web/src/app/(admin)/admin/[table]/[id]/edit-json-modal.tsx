'use client';

import { Button } from '@farmheaven/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@farmheaven/ui/components/ui/dialog';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateRow } from './actions';

export function EditJsonModal({
  table,
  id,
  pkColumn,
  initialJson,
}: {
  table: string;
  id: string;
  pkColumn: string;
  initialJson: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialJson);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    // Client-side JSON parse so we fail fast on typos before a network round trip.
    try {
      JSON.parse(value);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      return;
    }
    startTransition(async () => {
      const result = await updateRow(table, id, pkColumn, value);
      if (result.ok) {
        toast.success('Row updated');
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setValue(initialJson);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-zinc-700 text-zinc-100 hover:bg-zinc-800"
        >
          Edit JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="font-mono">Edit {table} row</DialogTitle>
          <DialogDescription className="text-amber-400">
            ⚠ You are editing live data via service-role. No undo.
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="min-h-[400px] w-full rounded border border-zinc-700 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
        />

        {error && (
          <pre className="rounded bg-red-950/40 p-3 text-xs text-red-300 whitespace-pre-wrap">
            {error}
          </pre>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={pending}
            className="bg-amber-500 text-zinc-950 hover:bg-amber-400"
          >
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
