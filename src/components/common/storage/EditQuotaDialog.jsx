"use client";

import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { uploadsApi } from "@/lib/api/uploads";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";

const GB = 1024 * 1024 * 1024;
const PRESETS = [5, 10, 20, 50, 100];

/** Admin: give one person a custom storage limit, or go back to the default for their role. */
export default function EditQuotaDialog({ person, defaults, onClose, onSaved }) {
  return (
    <Dialog open={Boolean(person)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {person && <QuotaForm key={person.id} person={person} defaults={defaults} onClose={onClose} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  );
}

function QuotaForm({ person, defaults, onClose, onSaved }) {
  const [gb, setGb] = useState(() => String(Math.round(((person.quotaBytes ?? 0) / GB) * 100) / 100));
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const value = Number(gb);
  const valid = Number.isFinite(value) && value > 0 && value <= 1024;
  const tooSmall = valid && value * GB < person.bytes;
  const roleDefault = defaults?.[person.role];

  const save = async (quotaMb) => {
    setBusy(quotaMb === null ? "reset" : "save");
    setError("");
    try {
      await uploadsApi.setQuota(person.id, quotaMb);
      await onSaved?.();
      onClose();
    } catch (e) {
      setError(e?.message || "Could not update the limit.");
    } finally {
      setBusy("");
    }
  };

  return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) save(Math.round(value * 1024));
            }}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Storage limit for {person.name}</DialogTitle>
              <DialogDescription>
                Currently using {formatBytes(person.bytes)} of {person.quotaReadable}. {roleDefault && `The ${person.role} default is ${roleDefault.readable}.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <Button variant="unstyled"
                    key={p}
                    type="button"
                    aria-pressed={value === p}
                    onClick={() => setGb(String(p))}
                    className={cn(
                      "h-9 rounded-lg border px-3 text-xs font-semibold transition-colors",
                      value === p ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
                    )}
                  >
                    {p} GB
                  </Button>
                ))}
              </div>
              <Label htmlFor="quota-gb" className="block text-xs leading-4 font-semibold text-slate-700 dark:text-slate-200">Custom limit (GB)</Label>
              <Input id="quota-gb" type="number" min="0.1" max="1024" step="0.1" inputMode="decimal" value={gb} onChange={(e) => setGb(e.target.value)} className="h-10" />
              {tooSmall && <p className="text-[11px] font-medium text-amber-600 dark:text-amber-300">This is below what they already use, so they won&apos;t be able to upload until they free up space.</p>}
              {error && <p role="alert" className="text-[11px] font-medium text-rose-600">{error}</p>}
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              <Button type="button" variant="ghost" disabled={Boolean(busy) || !person.isCustomQuota} onClick={() => save(null)} className="gap-1.5">
                {busy === "reset" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />} Reset to default
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={!valid || Boolean(busy)} className="gap-2">
                  {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" />} Save limit
                </Button>
              </div>
            </DialogFooter>
          </form>
  );
}
