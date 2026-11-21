"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeftRight, CheckCircle2, Cloud, Loader2, RefreshCw, Unplug } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { storageApi } from "@/lib/api/storage";
import { formatBytes } from "@/lib/attachments";
import { cn } from "@/lib/utils";
import ConnectDriveDialog from "./ConnectDriveDialog";
import ProviderCard, { ProviderCardSkeleton } from "./ProviderCard";
import { PROVIDER_COLOR, PROVIDER_PLACEHOLDERS } from "./providerMeta";

const LOADING_CAP_MS = 1000; // the full-block loader is never shown longer than this
const MAX_RETRIES = 2; // 1 try + 2 retries
const RETRY_DELAY_MS = 700;

let overviewCache = null; // last good response, reused instantly when the admin comes back to this page

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isClientError = (e) => {
  const s = e?.status ?? e?.response?.status;
  return s >= 400 && s < 500 && s !== 408 && s !== 429; // retrying a 401/403/404 will not help
};

async function fetchOverview(refresh) {
  let last;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await storageApi.overview({ refresh });
    } catch (e) {
      last = e;
      if (isClientError(e) || attempt === MAX_RETRIES) break;
      await sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }
  throw last;
}

/** Admin > Storage > "Storage providers": see every storage, pick where new uploads go, connect Google Drive. */
export default function StorageProviders() {
  const [data, setData] = useState(overviewCache);
  // loading: skeleton block (max 1s) · syncing: layout shown, details still arriving · ready · error
  const [phase, setPhase] = useState(overviewCache ? "ready" : "loading");
  const [fetching, setFetching] = useState(false);
  const [notice, setNotice] = useState(null); // { tone, text }
  const [busy, setBusy] = useState({ id: "", action: "" });
  const [confirm, setConfirm] = useState(null); // { type: "use" | "disconnect", provider }
  const [connecting, setConnecting] = useState(false);

  const alive = useRef(true);
  const reqId = useRef(0);
  const dataRef = useRef(overviewCache);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(async (refresh = false) => {
    const id = ++reqId.current;
    const current = () => alive.current && reqId.current === id;
    let timer;
    setFetching(true);
    if (!dataRef.current) {
      setPhase("loading");
      timer = setTimeout(() => current() && setPhase((p) => (p === "loading" ? "syncing" : p)), LOADING_CAP_MS);
    }
    try {
      const next = await fetchOverview(refresh);
      if (!current()) return true;
      overviewCache = next;
      dataRef.current = next;
      setData(next);
      setPhase("ready");
      return true;
    } catch (e) {
      if (!current()) return false;
      setPhase(dataRef.current ? "ready" : "error");
      setNotice({ tone: "error", text: e?.message || "Could not load the storage providers." });
      return false;
    } finally {
      clearTimeout(timer);
      if (current()) setFetching(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch (cached data, if any, is already on screen)
    load();
    // Google sends the admin back here with ?storage=connected or ?storage=error&message=...
    const params = new URLSearchParams(window.location.search);
    const result = params.get("storage");
    if (result) {
      setNotice(result === "connected" ? { tone: "success", text: "Google Drive is connected. Choose “Use for new uploads” when you want files to go there." } : { tone: "error", text: params.get("message") || "Google Drive could not be connected." });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [load]);

  const act = async (id, action, fn, success) => {
    setBusy({ id, action });
    setNotice(null);
    try {
      await fn();
      const ok = await load(true);
      if (ok && success) setNotice({ tone: "success", text: success });
    } catch (e) {
      setNotice({ tone: "error", text: e?.message || "Something went wrong. Please try again." });
    } finally {
      setBusy({ id: "", action: "" });
      setConfirm(null);
    }
  };

  const providers = data?.providers ?? [];
  const totalFiles = data?.totals?.files ?? 0;
  const totalBytes = data?.totals?.bytes ?? 0;
  const busyFor = (id) => (busy.id === id ? busy.action : "");
  const drive = providers.find((p) => p.id === "gdrive");

  return (
    <SectionCard
      icon={Cloud}
      title="Storage providers"
      description="New uploads go to the active provider. Older files stay where they are and keep working."
      iconClassName="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
      contentClassName="space-y-4 p-4 sm:p-5"
      action={
        <div className="flex items-center gap-2">
          {fetching && phase === "ready" && <span className="hidden text-[11px] text-slate-400 sm:inline">Updating…</span>}
          <Button type="button" variant="outline" size="sm" disabled={phase === "loading" || Boolean(busy.id)} onClick={() => act("all", "refresh", () => Promise.resolve())} className="gap-1.5">
            <RefreshCw className={cn("h-3.5 w-3.5", (busy.action === "refresh" || (fetching && phase === "ready")) && "animate-spin")} /> Refresh
          </Button>
        </div>
      }
    >
      {notice && (
        <p role={notice.tone === "error" ? "alert" : "status"} className={cn("flex items-start gap-2 rounded-xl px-3 py-2 text-xs font-medium", notice.tone === "error" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300")}>
          {notice.tone === "error" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />} {notice.text}
        </p>
      )}

      {phase === "loading" && <div className="h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />}

      {phase === "syncing" && (
        <>
          <p role="status" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Storage details are being prepared in the background. They will appear here automatically.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {PROVIDER_PLACEHOLDERS.map((p) => (
              <ProviderCardSkeleton key={p.id} {...p} />
            ))}
          </div>
        </>
      )}

      {phase === "error" && (
        <div className="space-y-3 rounded-xl border border-dashed border-rose-200 p-6 text-center dark:border-rose-500/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">Storage providers could not be loaded after several attempts.</p>
          <Button type="button" size="sm" variant="outline" onClick={() => { setNotice(null); load(true); }} disabled={fetching} className="gap-1.5">
            {fetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Try again
          </Button>
        </div>
      )}

      {phase === "ready" && data && (
        <>
          {totalFiles > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 sm:flex-1" role="img" aria-label="Files stored per provider">
                {providers.map((p) => (
                  <div key={p.id} className={cn("h-full", PROVIDER_COLOR[p.id])} style={{ width: `${(p.stored.bytes / Math.max(totalBytes, 1)) * 100}%` }} />
                ))}
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {providers.map((p) => (
                  <li key={p.id} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className={cn("h-2 w-2 rounded-full", PROVIDER_COLOR[p.id])} />
                    {p.label} <b className="tabular-nums text-slate-900 dark:text-white">{formatBytes(p.stored.bytes)}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {providers.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                totalFiles={totalFiles}
                busy={busyFor(p.id)}
                onUse={(prov) => setConfirm({ type: "use", provider: prov })}
                onConnect={() => setConnecting(true)}
                onDisconnect={(prov) => setConfirm({ type: "disconnect", provider: prov })}
                onRefresh={() => act(p.id, "refresh", () => Promise.resolve())}
              />
            ))}
          </div>
        </>
      )}

      <ConnectDriveDialog open={connecting} onOpenChange={setConnecting} drive={drive} redirectUri={data?.redirectUri ?? ""} />

      <Dialog open={Boolean(confirm)} onOpenChange={(open) => !open && !busy.id && setConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          {confirm && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", confirm.type === "disconnect" ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10" : "bg-primary-50 text-primary-600 dark:bg-primary-500/10")}>
                    {confirm.type === "disconnect" ? <Unplug className="h-4 w-4" /> : <ArrowLeftRight className="h-4 w-4" />}
                  </span>
                  <DialogTitle className="text-sm font-bold">
                    {confirm.type === "disconnect" ? `Disconnect ${confirm.provider.label}?` : `Use ${confirm.provider.label} for new uploads?`}
                  </DialogTitle>
                </div>
                <DialogDescription className="pt-2 text-xs leading-relaxed">
                  {confirm.type === "disconnect"
                    ? "Loyanox stops using this account and forgets its saved credentials. Files already in Google Drive stay there and their links keep working. You can connect it again any time."
                    : `From now on, files that interns and mentors upload are saved to ${confirm.provider.label}. Files uploaded before stay where they are and keep working. You can switch back at any time.`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="outline" size="sm" disabled={Boolean(busy.id)} onClick={() => setConfirm(null)}>Cancel</Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={Boolean(busy.id)}
                  className={cn("gap-1.5", confirm.type === "disconnect" && "bg-rose-600 text-white hover:bg-rose-700")}
                  onClick={() =>
                    confirm.type === "disconnect"
                      ? act(confirm.provider.id, "disconnect", () => storageApi.disconnect(confirm.provider.id), `${confirm.provider.label} disconnected.`)
                      : act(confirm.provider.id, "use", () => storageApi.setActive(confirm.provider.id), `New uploads now go to ${confirm.provider.label}.`)
                  }
                >
                  {busy.id && <Loader2 className="h-4 w-4 animate-spin" />} {confirm.type === "disconnect" ? "Disconnect" : `Use ${confirm.provider.label}`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
}
