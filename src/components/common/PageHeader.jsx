"use client";

/**
 * Shared page-level header: title + subtitle on the left, action buttons on the right.
 * Used by Profile Management, Settings, and future dashboard sub-pages.
 */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-4 shadow-[0_8px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/70 dark:bg-slate-900/60">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-500 dark:text-primary-400">Mentor workspace</p>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 dark:text-slate-500">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
