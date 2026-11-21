import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function Dot({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", className)}
    />
  );
}

export function TextBlock({ content }) {
  return (
    <div className="space-y-2.5">
      {content.map((paragraph, i) => (
        <p key={i} className="max-w-4xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function ListBlock({ content }) {
  return (
    <ul className="space-y-2">
      {content.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300"
        >
          <Dot className="bg-slate-300 dark:bg-slate-600" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ChecklistBlock({ content }) {
  return (
    <ul className="space-y-2">
      {content.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
        >
          <CheckCircle2
            className="h-3.5 w-3.5 shrink-0 text-primary-500 dark:text-primary-400"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PointsBlock({ content }) {
  return (
    <ul className="space-y-4">
      {content.map((point, i) => (
        <li key={i} className="flex items-start gap-3">
          <Dot className="mt-1.5 bg-primary-500" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{point.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {point.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function GroupsBlock({ content }) {
  return (
    <div className="space-y-4">
      {content.map((group, i) => (
        <div key={i} className="flex items-start gap-3">
          <Dot className="mt-1.5 bg-primary-500" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{group.title}</p>
            <ul className="mt-1.5 space-y-1.5">
              {group.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepsBlock({ content }) {
  return (
    <ol className="space-y-2.5">
      {content.map((step, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300"
        >
          <span
            aria-hidden="true"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
          >
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export const BLOCKS = {
  text: TextBlock,
  list: ListBlock,
  checklist: ChecklistBlock,
  points: PointsBlock,
  groups: GroupsBlock,
  steps: StepsBlock,
};
