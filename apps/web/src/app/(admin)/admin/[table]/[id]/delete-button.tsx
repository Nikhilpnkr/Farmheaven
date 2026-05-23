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
import { Input } from '@farmheaven/ui/components/ui/input';
import { Label } from '@farmheaven/ui/components/ui/label';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteRow } from './actions';

export function DeleteButton({
  table,
  id,
  pkColumn,
}: {
  table: string;
  id: string;
  pkColumn: string;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canDelete = typed === id;

  function handleDelete() {
    if (!canDelete) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteRow(table, id, pkColumn);
      // On success deleteRow redirects, so we won't reach here.
      // On failure, surface the error.
      if (result && !result.ok) {
        setError(result.error);
        toast.error('Delete failed');
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setTyped('');
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="font-mono text-red-400">Delete {table} row</DialogTitle>
          <DialogDescription>
            Type the row's {pkColumn} exactly to confirm deletion. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label className="font-mono text-xs">{pkColumn} to delete</Label>
          <code className="block rounded bg-zinc-950 p-2 font-mono text-xs text-zinc-300 break-all">
            {id}
          </code>
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={`paste the ${pkColumn} here`}
            className="border-zinc-700 bg-zinc-950 font-mono text-xs text-zinc-100"
          />
        </div>

        {error && (
          <pre className="rounded bg-red-950/40 p-3 text-xs text-red-300 whitespace-pre-wrap">
            {error}
          </pre>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!canDelete || pending} onClick={handleDelete}>
            {pending ? 'Deleting…' : 'Delete forever'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
