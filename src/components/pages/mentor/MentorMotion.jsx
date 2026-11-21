"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared motion primitives for the mentor console.
 * - Reveal:  enter animation (fade + rise) that plays when the element scrolls into view.
 *            Elements entering the viewport together are staggered top -> bottom.
 * - CountUp: animates a number from 0 to its value once it scrolls into view.
 * - useInView: one-shot viewport trigger used by the helpers above (and progress bars).
 * Everything respects `prefers-reduced-motion`.
 */

export const STAGGER_MS = 45;
const MAX_STAGGER_STEPS = 14;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function staggerDelay(index = 0, base = 0) {
  return base + Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- shared one-shot IntersectionObserver ---------- */

const callbacks = new WeakMap();
let sharedObserver = null;

function getObserver() {
  if (sharedObserver || typeof IntersectionObserver === "undefined") return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      // Everything that becomes visible in the same pass is revealed top -> bottom, left -> right.
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          const dy = Math.round(a.boundingClientRect.top) - Math.round(b.boundingClientRect.top);
          return dy !== 0 ? dy : a.boundingClientRect.left - b.boundingClientRect.left;
        });
      visible.forEach((entry, order) => {
        const cb = callbacks.get(entry.target);
        sharedObserver.unobserve(entry.target);
        callbacks.delete(entry.target);
        if (cb) cb(order);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -48px 0px" }
  );
  return sharedObserver;
}

/**
 * Returns [ref, inView, order]. `inView` flips to true once (and stays true) the first time the
 * element enters the viewport. `order` is its position among elements revealed in the same pass.
 * Pass `enabled = false` to skip observing (value is then reported as already in view).
 */
export function useInView(enabled = true) {
  const ref = useRef(null);
  const [state, setState] = useState({ inView: false, order: 0 });

  useEffect(() => {
    if (!enabled) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const observer = getObserver();
    if (prefersReducedMotion() || !observer) {
      setState({ inView: true, order: 0 });
      return undefined;
    }

    callbacks.set(node, (order) => setState({ inView: true, order }));
    observer.observe(node);
    return () => {
      observer.unobserve(node);
      callbacks.delete(node);
    };
  }, [enabled]);

  return [ref, enabled ? state.inView : true, state.order];
}

/** Lets descendants of a <Reveal> (count-ups, backdrops, bars) start in sync with it. */
const RevealContext = createContext(null);
export const useRevealed = () => useContext(RevealContext);

export function Reveal({
  as: Tag = "div",
  index = 0,
  delay = 0,
  fade = false,
  duration = 550,
  className,
  style,
  children,
  ...props
}) {
  const [ref, inView, order] = useInView();

  return (
    <RevealContext.Provider value={inView}>
      <Tag
        ref={ref}
        className={cn(
          inView
            ? cn(
                "animate-in fade-in motion-reduce:animate-none",
                !fade && "slide-in-from-bottom-3"
              )
            : "opacity-0 motion-reduce:opacity-100",
          className
        )}
        style={{
          animationDuration: `${duration}ms`,
          animationDelay: `${staggerDelay(order, delay)}ms`,
          animationTimingFunction: EASE,
          animationFillMode: "backwards",
          ...style,
        }}
        {...props}
      >
        {children}
      </Tag>
    </RevealContext.Provider>
  );
}

export function CountUp({ value, suffix = "", duration = 900, delay = 0, className }) {
  const target = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  const parentInView = useRevealed();
  const [ref, ownInView] = useInView(parentInView === null);
  const active = parentInView === null ? ownInView : parentInView;

  useEffect(() => {
    if (!active) return undefined;

    if (prefersReducedMotion()) {
      current.current = target;
      setDisplay(target);
      return undefined;
    }

    const from = current.current;
    let frame = 0;
    let startedAt = null;

    const tick = (now) => {
      if (startedAt === null) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;
      current.current = next;
      setDisplay(Math.round(next));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [active, target, duration, delay]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
      {suffix}
    </span>
  );
}
