"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Highlight that glides between the active items instead of jumping. */
export function useSlidingPill(navRef, pathname) {
  const [pill, setPill] = useState(null);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    const measure = () => {
      const el = nav.querySelector('[data-nav-active="true"]');
      if (!el) {
        setPill(null);
        return;
      }
      let x = 0;
      let y = 0;
      let node = el;
      while (node && node !== nav) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent;
      }
      setPill({ x, y, w: el.offsetWidth, h: el.offsetHeight, instant: !placed.current });
      placed.current = true;
    };

    measure();
    let initial = true;
    const observer = new ResizeObserver(() => {
      if (initial) {
        initial = false;
        return;
      }
      placed.current = false;
      measure();
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, [navRef, pathname]);

  return pill;
}

// Staggered slide-in used by every sidebar row
export const ENTER =
  "animate-in fade-in slide-in-from-left-8 zoom-in-95 fill-mode-backwards duration-700 motion-reduce:animate-none";

export const enterDelay = (i) => ({
  animationDelay: `${120 + i * 75}ms`,
  animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
});
