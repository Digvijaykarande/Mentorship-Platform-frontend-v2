"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { AlertTriangle, ChevronDown, ExternalLink, Loader2, Plug, RefreshCw, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";
import { UsageBar } from "../AdminBits";
import { ProviderMark, STATUS_UI, fmtDateTime, maskEmail, maskText } from "./providerMeta";

const pct = (used, limit) => (limit > 0 ? Math.min(100, Math.round((used / limit) * 1000) / 10) : 0);

function Meter({ label, used, limit, hint }) {
  const percent = pct(used, limit);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">
          <b className="text-slate-900 dark:text-white">{formatBytes(used)}</b>
          {limit ? ` / ${formatBytes(limit)} · ${percent}%` : " used"}
        </span>
      </div>
      {limit ? <UsageBar percent={percent} /> : null}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

const Row = ({ label, children }) =>
  children ? (
    <div className="flex items-start justify-between gap-4 py-1.5 text-xs">
      <dt className="shrink-0 text-slate-400">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium text-slate-700 dark:text-slate-200">{children}</dd>
    </div>
  ) : null;

function Identity({ provider }) {
  const a = provider.account;
  if (!a) return null;
  if (provider.id === "gdrive") {
    return (
      <div className="flex items-center gap-2.5">
        <Avatar className="size-7 after:hidden">
          {a.picture && <AvatarImage src={a.picture} alt="" referrerPolicy="no-referrer" />}
          <AvatarFallback className="bg-primary-50 text-[11px] font-bold text-primary-700 dark:bg-primary-500/10">{(a.name || a.email || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className="min-w-0 truncate text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">{a.name || "Google account"}</span> · {maskEmail(a.email)}
        </p>
      </div>
    );
  }
  return a.cloudName ? (
    <p className="text-xs text-slate-600 dark:text-slate-300">
      Cloud <span className="font-semibold text-slate-900 dark:text-white">{maskText(a.cloudName)}</span>
    </p>
  ) : null;
}

/** Placeholder card shown while the server is still preparing the numbers. */
export function ProviderCardSkeleton({ id, label }) {
  return (
    <article aria-busy="true" aria-label={label} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <header className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200/80 dark:bg-slate-800/60 dark:ring-slate-700">
          <ProviderMark id={id} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{label}</h3>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading latest usage…
          </span>
        </div>
      </header>
      <div className="space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </article>
  );
}

/** One storage provider, kept compact. Sensitive identifiers are masked or left out entirely. */
export default function ProviderCard({ provider, totalFiles, busy, onUse, onConnect, onDisconnect, onRefresh }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_UI[provider.status] ?? STATUS_UI.not_configured;
  const isDrive = provider.id === "gdrive";
  const ready = provider.status === "connected";
  const u = provider.usage;
  const q = provider.quota;
  const share = totalFiles ? Math.round((provider.stored.files / totalFiles) * 100) : 0;
  const showDetails = provider.status !== "not_configured";

  return (
    <article
      aria-label={provider.label}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900/60",
        provider.active ? "border-primary-300 ring-1 ring-primary-500/20 dark:border-primary-500/40" : "border-slate-200/80 dark:border-slate-800",
      )}
    >
      <header className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200/80 dark:bg-slate-800/60 dark:ring-slate-700">
          <ProviderMark id={provider.id} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{provider.label}</h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", status.chip)}>{status.label}</span>
            {provider.active && <span className="inline-flex rounded-full bg-primary-600 px-2 py-0.5 text-[11px] font-semibold text-white">Active for uploads</span>}
          </div>
        </div>
        {ready && (
          <Button type="button" variant="ghost" size="icon-sm" aria-label={`Check ${provider.label} again`} onClick={() => onRefresh(provider.id)} disabled={Boolean(busy)}>
            <RefreshCw className={cn("h-4 w-4", busy === "refresh" && "animate-spin")} />
          </Button>
        )}
      </header>

      {provider.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {provider.error}
        </p>
      )}

      {provider.status === "not_configured" && (
        <p className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-xs leading-relaxed text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {isDrive ? "Save files in a Google Drive you own. Connect once, switch any time." : "Cloudinary is configured on the server. Ask your developer to set it up."}
        </p>
      )}

      <Identity provider={provider} />

      {isDrive && q && <Meter label="Drive space" used={q.usage} limit={q.limit} />}

      {!isDrive && u && (
        <div className="grid gap-3 sm:grid-cols-2">
          {u.storageBytes !== null && <Meter label="Storage" used={u.storageBytes} limit={u.storageLimitBytes} />}
          {u.credits?.percent !== null && u.credits?.percent !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Monthly credits</span>
                <span className="tabular-nums text-slate-500 dark:text-slate-400">
                  <b className="text-slate-900 dark:text-white">{u.credits.used ?? "?"}</b>
                  {u.credits.limit ? ` / ${u.credits.limit}` : ""} · {u.credits.percent}%
                </span>
              </div>
              <UsageBar percent={u.credits.percent} />
            </div>
          )}
        </div>
      )}

      <p className="flex flex-wrap items-baseline justify-between gap-x-3 rounded-xl bg-slate-50/70 px-3 py-2 text-xs dark:bg-slate-900/40">
        <span className="font-semibold text-slate-700 dark:text-slate-200">Kept by Loyanox</span>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">
          <b className="text-slate-900 dark:text-white">{provider.stored.readable}</b> · {provider.stored.files} file{provider.stored.files === 1 ? "" : "s"}
          {totalFiles ? ` · ${share}%` : ""}
        </span>
      </p>

      {showDetails && (
        <>
          <Button variant="unstyled" type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-fit items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} /> {open ? "Hide details" : "Show details"}
          </Button>
          {open && (
            <dl className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {isDrive ? (
                <>
                  <Row label="Connected">{provider.connectedAt && `${fmtDateTime(provider.connectedAt)}${provider.connectedByName ? ` by ${provider.connectedByName}` : ""}`}</Row>
                  <Row label="Folder">
                    {provider.folder && (
                      <a href={provider.folder.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-300">
                        {provider.folder.name} <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </Row>
                  <Row label="In Drive / trash">{q ? `${formatBytes(q.inDrive)} / ${formatBytes(q.inTrash)}` : null}</Row>
                  <Row label="Access">Only files created by Loyanox</Row>
                  <Row label="Last checked">{fmtDateTime(provider.checkedAt)}</Row>
                </>
              ) : (
                <>
                  <Row label="Plan">{u?.plan}</Row>
                  <Row label="Assets">{u?.assets != null ? u.assets.toLocaleString("en-IN") : null}</Row>
                  <Row label="Bandwidth">{u?.bandwidthBytes != null ? formatBytes(u.bandwidthBytes) : null}</Row>
                  <Row label="Transformations">{u?.transformations != null ? u.transformations.toLocaleString("en-IN") : null}</Row>
                  <Row label="Largest file">{u?.maxFileBytes?.image ? `${formatBytes(u.maxFileBytes.image)} (images)` : null}</Row>
                  <Row label="Response time">{u?.latencyMs ? `${u.latencyMs} ms` : null}</Row>
                  <Row label="Last checked">{fmtDateTime(provider.checkedAt)}</Row>
                </>
              )}
            </dl>
          )}
        </>
      )}

      <footer className="mt-auto flex flex-wrap items-center gap-2">
        {ready && !provider.active && (
          <Button type="button" size="sm" onClick={() => onUse(provider)} disabled={Boolean(busy)} className="gap-1.5">
            {busy === "use" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Use for new uploads
          </Button>
        )}
        {isDrive && (provider.status === "not_configured" || provider.status === "needs_reauth") && (
          <Button type="button" size="sm" onClick={onConnect} className="gap-1.5">
            <Plug className="h-3.5 w-3.5" /> {provider.status === "needs_reauth" ? "Reconnect" : "Connect Google Drive"}
          </Button>
        )}
        {isDrive && ready && (
          <Button type="button" size="sm" variant="outline" onClick={onConnect} disabled={Boolean(busy)}>
            Reconnect
          </Button>
        )}
        {isDrive && provider.configured && (
          <Button type="button" size="sm" variant="ghost" onClick={() => onDisconnect(provider)} disabled={Boolean(busy) || provider.active} title={provider.active ? "Switch new uploads to another storage first" : undefined} className="gap-1.5 text-rose-600 hover:text-rose-700">
            <Unplug className="h-3.5 w-3.5" /> Disconnect
          </Button>
        )}
        {ready && provider.active && <span className="text-xs font-medium text-slate-400">New uploads are saved here.</span>}
      </footer>
    </article>
  );
}
