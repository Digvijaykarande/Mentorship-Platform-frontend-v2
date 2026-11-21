"use client";

import { CountUp, Reveal } from "@/components/pages/mentor/MentorMotion";

export { CountUp, Reveal };

/**
 * Renders a stat value, counting up when it is a whole number ("12", "76%", "$40").
 * Anything else (decimals, "4.8/5", text) is shown as-is.
 */
export function AnimatedValue({ value, className, duration = 900, delay = 150 }) {
  const raw = typeof value === "number" ? String(value) : value;
  const match = typeof raw === "string" ? raw.match(/^(\D*)(\d+)(\D*)$/) : null;
  if (!match) return <span className={className}>{value}</span>;
  const [, prefix, digits, suffix] = match;
  return (
    <span className={className}>
      {prefix}
      <CountUp value={Number(digits)} suffix={suffix} duration={duration} delay={delay} />
    </span>
  );
}
