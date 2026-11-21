"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "./MentorMotion";

/* ------------------------------------------------------------------ */
/* Tone palette (static strings so Tailwind can see every class)       */
/* ------------------------------------------------------------------ */
export const MODAL_TONES = {
  indigo: {
    tile: "bg-linear-to-br from-primary-500 to-violet-600 text-white shadow-primary-500/30",
    soft: "from-primary-50 via-white to-violet-50 dark:from-primary-500/10 dark:via-slate-900 dark:to-violet-500/10",
    btn: "bg-primary-600! text-white! shadow-primary-600/25 hover:bg-primary-700!",
  },
  violet: {
    tile: "bg-linear-to-br from-violet-500 to-fuchsia-600 text-white shadow-violet-500/30",
    soft: "from-violet-50 via-white to-fuchsia-50 dark:from-violet-500/10 dark:via-slate-900 dark:to-fuchsia-500/10",
    btn: "bg-violet-600! text-white! shadow-violet-600/25 hover:bg-violet-700!",
  },
  emerald: {
    tile: "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
    soft: "from-emerald-50 via-white to-teal-50 dark:from-emerald-500/10 dark:via-slate-900 dark:to-teal-500/10",
    btn: "bg-emerald-600! text-white! shadow-emerald-600/25 hover:bg-emerald-700!",
  },
  rose: {
    tile: "bg-linear-to-br from-rose-500 to-orange-500 text-white shadow-rose-500/30",
    soft: "from-rose-50 via-white to-orange-50 dark:from-rose-500/10 dark:via-slate-900 dark:to-orange-500/10",
    btn: "bg-rose-600! text-white! shadow-rose-600/25 hover:bg-rose-700!",
  },
  amber: {
    tile: "bg-linear-to-br from-secondary-400 to-orange-500 text-white shadow-secondary-500/30",
    soft: "from-secondary-50 via-white to-orange-50 dark:from-secondary-500/10 dark:via-slate-900 dark:to-orange-500/10",
    btn: "bg-secondary-500! text-white! shadow-secondary-500/25 hover:bg-secondary-600!",
  },
  sky: {
    tile: "bg-linear-to-br from-sky-500 to-primary-500 text-white shadow-sky-500/30",
    soft: "from-sky-50 via-white to-primary-50 dark:from-sky-500/10 dark:via-slate-900 dark:to-primary-500/10",
    btn: "bg-sky-600! text-white! shadow-sky-600/25 hover:bg-sky-700!",
  },
};

const SIZES = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  "2xl": "sm:max-w-5xl",
};

/**
 * Keeps showing the last non-null value so a modal's content doesn't vanish
 * while its close animation is still playing.
 */
export function useRetained(value) {
  const [held, setHeld] = useState(value);
  if (value != null && value !== held) setHeld(value);
  return value ?? held;
}

/* ------------------------------------------------------------------ */
/* Centered modal shell                                                */
/* ------------------------------------------------------------------ */
export function MentorModal({
  open,
  onOpenChange,
  size = "lg",
  icon: Icon,
  leading,
  tone = "indigo",
  badges,
  title,
  description,
  children,
  footer,
  onSubmit,
  bodyClassName,
  compact = false,
}) {
  const t = MODAL_TONES[tone] || MODAL_TONES.indigo;
  const Shell = onSubmit ? "form" : "div";
  const shellProps = onSubmit ? { onSubmit, noValidate: true } : {};

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm duration-300 data-closed:duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[92dvh] w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl shadow-slate-900/25 outline-none ring-1 ring-slate-900/5 duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] data-closed:duration-200 data-closed:ease-in data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-bottom-4 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:slide-out-to-bottom-2 motion-reduce:animate-none dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10",
            SIZES[size] || SIZES.lg
          )}
        >
          <Shell {...shellProps} className="flex min-h-0 flex-1 flex-col">
            {/* Header */}
            <div
              className={cn(
                "relative shrink-0 animate-in fade-in slide-in-from-top-2 duration-400 border-b border-slate-200/70 bg-linear-to-br dark:border-slate-800",
                compact ? "px-5 py-3.5" : "px-6 py-5",
                t.soft
              )}
            >
              <div className={cn("flex items-start pr-9", compact ? "gap-3" : "gap-4")}>
                {leading ||
                  (Icon && (
                    <div
                      className={cn(
                        "admin-pop flex shrink-0 items-center justify-center shadow-lg",
                        compact ? "h-10 w-10 rounded-xl" : "h-12 w-12 rounded-2xl",
                        t.tile
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  ))}
                <div className="min-w-0 flex-1" style={{display:"flex",flexDirection:"column-reverse"}}>
                  {badges && (
                    <div className={cn("flex flex-wrap items-center gap-2", compact ? "mb-1" : "mb-1.5")}>{badges}</div>
                  )}
                  <DialogPrimitive.Title className={cn("font-bold leading-tight tracking-tight text-slate-900 dark:text-white", compact ? "text-base" : "text-lg")}>
                    {title}
                  </DialogPrimitive.Title>
                  {description && (
                    <DialogPrimitive.Description className={cn("text-xs leading-relaxed text-slate-500 dark:text-slate-400", compact ? "mt-0.5" : "mt-1")}>
                      {description}
                    </DialogPrimitive.Description>
                  )}
                </div>
              </div>
              <DialogPrimitive.Close
                render={
                  <Button variant="unstyled"
                    type="button"
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-900/5 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  />
                }
              >
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            {/* Body */}
            <div style={{ animationDelay: "90ms", animationFillMode: "backwards" }} className={cn("min-h-0 flex-1 animate-in fade-in duration-500 motion-reduce:animate-none overflow-y-auto", compact ? "px-5 py-4" : "px-6 py-5", bodyClassName)}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={{ animationDelay: "160ms", animationFillMode: "backwards" }} className={cn("flex shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none flex-col-reverse gap-2 border-t border-slate-200/70 bg-slate-50/80 sm:flex-row sm:items-center sm:justify-end dark:border-slate-800 dark:bg-slate-950/40", compact ? "px-5 py-3" : "px-6 py-4")}>
                {footer}
              </div>
            )}
          </Shell>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
export function ModalButton({ variant = "primary", tone = "indigo", className, children, ...props }) {
  const t = MODAL_TONES[tone] || MODAL_TONES.indigo;
  return (
    <Button
      variant={variant === "primary" ? "default" : "outline"}
      className={cn(
        "h-10! gap-2 rounded-xl! px-4! text-[13px]! font-semibold",
        variant === "primary"
          ? cn("shadow-md", t.btn)
          : "border-slate-200! bg-white! text-slate-700! hover:bg-slate-100! dark:border-slate-700! dark:bg-slate-800! dark:text-slate-200! dark:hover:bg-slate-700!",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

export function ModalActions({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel,
  icon: Icon,
  tone = "indigo",
  disabled,
}) {
  return (
    <>
      <ModalButton type="button" variant="secondary" onClick={onCancel}>
        {cancelLabel}
      </ModalButton>
      <ModalButton type="submit" tone={tone} disabled={disabled}>
        {Icon && <Icon className="h-4 w-4" />}
        {submitLabel}
      </ModalButton>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Detail-view building blocks                                         */
/* ------------------------------------------------------------------ */
export function InfoTile({ icon: Icon, label, value, children, className }) {
  return (
    <Reveal
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/50",
        className
      )}
    >
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <div className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
        {value ?? children}
      </div>
    </Reveal>
  );
}

export function DetailSection({ title, count, action, children, className }) {
  return (
    <Reveal as="section" className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
          {typeof count === "number" && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {count}
            </span>
          )}
        </h3>
        {action}
      </div>
      {children}
    </Reveal>
  );
}

export function Chip({ children, className }) {
  return (
    <span
      className={cn(
        "rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        className
      )}
    >
      {children}
    </span>
  );
}
