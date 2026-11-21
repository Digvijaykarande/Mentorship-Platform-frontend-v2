"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadsApi } from "@/lib/api/uploads";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { mb: 1024, label: "+1 GB" },
  { mb: 5120, label: "+5 GB" },
  { mb: 10240, label: "+10 GB" },
];

/** Asks the admins for more space. They get a notification and can raise the limit. */
export default function RequestSpaceDialog({ open, onOpenChange, onSent }) {
  const [mb, setMb] = useState(OPTIONS[0].mb);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await uploadsApi.requestMore({ requestedMb: mb, ...(reason.trim() && { reason: reason.trim() }) });
      setReason("");
      onOpenChange(false);
      onSent?.();
    } catch (err) {
      setError(err?.message || "Could not send the request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Request more storage</DialogTitle>
            <DialogDescription>Your admins are notified and can raise your limit. You can send one request per day.</DialogDescription>
          </DialogHeader>

          <div role="group" aria-labelledby="storage-extra-label" className="space-y-2">
            <Label id="storage-extra-label" className="block text-xs leading-4 font-semibold text-slate-700 dark:text-slate-200">How much extra space do you need?</Label>
            <div className="grid grid-cols-3 gap-2">
              {OPTIONS.map((o) => (
                <Button variant="unstyled"
                  key={o.mb}
                  type="button"
                  aria-pressed={mb === o.mb}
                  onClick={() => setMb(o.mb)}
                  className={cn(
                    "h-10 rounded-xl border text-sm font-semibold transition-colors",
                    mb === o.mb
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="storage-reason" className="block text-xs leading-4 font-semibold text-slate-700 dark:text-slate-200">
              Why do you need it? <span className="font-normal text-slate-400">(optional)</span>
            </Label>
            <Textarea id="storage-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} rows={3} placeholder="e.g. Final project demo videos" />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy} className="gap-2">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
