"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { storageApi } from "@/lib/api/storage";
import { DriveMark } from "./providerMeta";

const LINKS = {
  project: "https://console.cloud.google.com/projectcreate",
  api: "https://console.cloud.google.com/apis/library/drive.googleapis.com",
  consent: "https://console.cloud.google.com/auth/overview",
  credentials: "https://console.cloud.google.com/apis/credentials",
};

function Ext({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline dark:text-primary-300">
      {children} <ExternalLink className="h-3 w-3" />
    </a>
  );
}

/** Connect (or reconnect) Google Drive: paste the Google credentials once, then sign in with Google. */
export default function ConnectDriveDialog({ open, onOpenChange, drive, redirectUri }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {open && <ConnectForm drive={drive} redirectUri={redirectUri} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function ConnectForm({ drive, redirectUri, onClose }) {
  const hasSaved = Boolean(drive?.hasClient);
  const [editing, setEditing] = useState(!hasSaved);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const ready = !editing || (clientId.trim().length >= 10 && clientSecret.trim().length >= 8);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(redirectUri);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy. Select the address and copy it by hand.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      const body = editing ? { clientId: clientId.trim(), clientSecret: clientSecret.trim() } : {};
      const { authUrl } = await storageApi.connectDrive({ ...body, returnTo: window.location.origin });
      window.location.assign(authUrl); // Google asks the admin to allow access, then sends them back here
    } catch (err) {
      setError(err?.message || "Could not start the connection.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200 dark:bg-slate-800">
            <DriveMark className="h-5 w-5" />
          </span>
          <div>
            <DialogTitle>{drive?.configured ? "Reconnect Google Drive" : "Connect Google Drive"}</DialogTitle>
            <DialogDescription>Files are saved in the Google Drive you sign in with. Nothing else in that Drive is read.</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {!editing ? (
        <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/40">
          <p className="font-semibold text-slate-800 dark:text-slate-100">Google app credentials are already saved</p>
          <p className="text-slate-500 dark:text-slate-400">Client ID {drive.clientIdMasked}. Continue to sign in with Google again.</p>
          <Button variant="unstyled" type="button" onClick={() => setEditing(true)} className="font-semibold text-primary-600 hover:underline dark:text-primary-300">
            Use different credentials
          </Button>
        </div>
      ) : (
        <>
          <ol className="space-y-3.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">1</span>
              <span>
                <Ext href={LINKS.project}>Create a Google Cloud project</Ext> (or pick one you have), then <Ext href={LINKS.api}>turn on the Google Drive API</Ext>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">2</span>
              <span>
                Open the <Ext href={LINKS.consent}>Google Auth platform</Ext>, choose <b>External</b>, fill the app name and your email, then <b>publish the app</b>. If it stays in Testing, Google ends the connection after 7 days.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">3</span>
              <span className="min-w-0 flex-1 space-y-2">
                <span className="block">
                  In <Ext href={LINKS.credentials}>Credentials</Ext>, create an <b>OAuth client ID</b> of type <b>Web application</b> and add this as an authorised redirect URI:
                </span>
                <span className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-100" title={redirectUri}>
                    {redirectUri}
                  </code>
                  <Button type="button" size="sm" variant="outline" onClick={copy} className="shrink-0 gap-1">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
                  </Button>
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">4</span>
              <span>Paste the Client ID and Client Secret Google shows you.</span>
            </li>
          </ol>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="g-client-id" className="block text-xs leading-4 font-semibold text-slate-700 dark:text-slate-200">Client ID</Label>
              <Input id="g-client-id" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="123456-abc.apps.googleusercontent.com" autoComplete="off" spellCheck={false} className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-client-secret" className="block text-xs leading-4 font-semibold text-slate-700 dark:text-slate-200">Client Secret</Label>
              <Input id="g-client-secret" type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="GOCSPX-…" autoComplete="new-password" spellCheck={false} className="h-10" />
              <p className="text-[11px] text-slate-400">Saved encrypted on the server and never shown again.</p>
            </div>
          </div>
        </>
      )}

      {error && <p role="alert" className="text-[11px] font-medium text-rose-600">{error}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button type="submit" disabled={!ready || busy} className="gap-2">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Continue with Google
        </Button>
      </DialogFooter>
    </form>
  );
}
