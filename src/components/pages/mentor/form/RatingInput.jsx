"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const RATING_MIN = 0.5;
const RATING_MAX = 5;
const RATING_PRESETS = [3, 3.5, 4, 4.5, 5];

const clampRating = (n) =>
  Math.min(RATING_MAX, Math.max(RATING_MIN, Math.round(Number(n) * 10) / 10));

function ratingLabel(v) {
  if (v >= 4.8) return "Outstanding";
  if (v >= 4) return "Great";
  if (v >= 3) return "Good";
  if (v >= 2) return "Fair";
  return "Needs work";
}

/**
 * Simple precision rating (0.5 - 5.0, step 0.1). Full-width control:
 * - tap a star for a whole rating, or a chip (3.5, 4.5 ...) for a quick pick
 * - drag the slider to fine-tune to the nearest 0.1
 */
export function RatingInput({ value, onChange }) {
  const current = clampRating(Number.isFinite(Number(value)) ? Number(value) : RATING_MAX);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const fill = Math.min(1, Math.max(0, current - (star - 1)));
            return (
              <Button
                variant="unstyled"
                type="button"
                key={star}
                onClick={() => onChange(star)}
                aria-label={`Rate ${star} out of 5`}
                className="relative rounded-md p-0.5 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400/50"
              >
                <Star className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                <span
                  className="pointer-events-none absolute inset-y-0.5 left-0.5 overflow-hidden"
                  style={{ width: `calc((100% - 0.25rem) * ${fill})` }}
                >
                  <Star className="h-6 w-6 max-w-none fill-secondary-400 text-secondary-400" />
                </span>
              </Button>
            );
          })}
        </div>

        <div className="flex items-baseline gap-2 text-right">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {ratingLabel(current)}
          </span>
          <span className="text-2xl font-bold leading-none tabular-nums text-slate-900 dark:text-white">
            {current.toFixed(1)}
            <span className="ml-0.5 text-xs font-semibold text-slate-400">/5</span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <Slider
          min={RATING_MIN}
          max={RATING_MAX}
          step={0.1}
          value={[current]}
          onValueChange={(v) => onChange(clampRating(Array.isArray(v) ? v[0] : v))}
          getAriaLabel={() => "Rating"}
          getAriaValueText={() => `${current.toFixed(1)} out of 5, ${ratingLabel(current)}`}
          className="h-2 w-full min-w-32 flex-1 basis-2/5 cursor-pointer [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-slate-200 [&_[data-slot=slider-range]]:bg-[#fb923c] [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-secondary-500"
        />

        <div className="flex flex-wrap gap-1.5">
          {RATING_PRESETS.map((preset) => (
            <Button
              variant="unstyled"
              type="button"
              key={preset}
              onClick={() => onChange(preset)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums transition",
                current === preset
                  ? "bg-secondary-100 text-secondary-800 ring-1 ring-secondary-300 dark:bg-secondary-500/15 dark:text-secondary-300 dark:ring-secondary-500/40"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {preset.toFixed(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
