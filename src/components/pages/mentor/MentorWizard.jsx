"use client";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./MentorMotion";

const TONES = {
  indigo: {
    active: "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300",
    dot: "bg-primary-600 text-white",
    line: "bg-primary-400",
  },
  violet: {
    active: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    dot: "bg-violet-600 text-white",
    line: "bg-violet-400",
  },
};

/** Stepper with animated dot state and a connector line that fills as steps complete. */
export function WizardStepper({ steps, step, onSelect, tone = "indigo" }) {
  const t = TONES[tone] || TONES.indigo;
  return (
    <Reveal as="ol" className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <Button variant="unstyled"
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold transition-all duration-300 ease-out",
                active ? t.active : done ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] transition-all duration-300 ease-out",
                  active && "scale-110",
                  active || done ? t.dot : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                )}
              >
                {done ? (
                  <Check key="done" className="h-3.5 w-3.5 animate-in zoom-in-50 fade-in duration-300" />
                ) : (
                  i + 1
                )}
              </span>
              {s.label}
            </Button>
            {i < steps.length - 1 && (
              <span className="relative h-px flex-1 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <span
                  className={cn(
                    "absolute inset-0 origin-left transition-transform duration-500 ease-out motion-reduce:transition-none",
                    t.line,
                    done ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </Reveal>
  );
}

/** Wraps the step body; slides in from the right going forward, from the left going back. */
export function StepPanel({ step, className, children }) {
  const prev = useRef(step);
  const direction = useRef("forward");
  if (prev.current !== step) {
    direction.current = step > prev.current ? "forward" : "back";
    prev.current = step;
  }
  return (
    <div className={cn("-mx-1 overflow-x-clip px-1", className)}>
      <div
        key={step}
        className={direction.current === "back" ? "admin-step-back" : "admin-step-forward"}
      >
        {children}
      </div>
    </div>
  );
}
