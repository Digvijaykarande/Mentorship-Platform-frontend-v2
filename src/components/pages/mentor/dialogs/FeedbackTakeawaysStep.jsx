import { Target, ThumbsUp } from "lucide-react";
import { ListEditor } from "../MentorForm";
import { Reveal } from "../MentorMotion";

export default function FeedbackTakeawaysStep({ form, update }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Reveal className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" /> Key strengths
          <span className="font-medium text-slate-400">· what went well</span>
        </p>
        <div className="max-h-[220px] overflow-y-auto pr-1">
          <ListEditor
            variant="bullet"
            value={form.strengths}
            onChange={(v) => update("strengths", v)}
            placeholder="A strength to highlight"
            addLabel="Add strength"
          />
        </div>
      </Reveal>
      <Reveal className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Target className="h-3.5 w-3.5 text-violet-500" /> Improvements
          <span className="font-medium text-slate-400">· work on next</span>
        </p>
        <div className="max-h-[220px] overflow-y-auto pr-1">
          <ListEditor
            variant="bullet"
            value={form.improvements}
            onChange={(v) => update("improvements", v)}
            placeholder="A concrete next step"
            addLabel="Add improvement"
          />
        </div>
      </Reveal>
    </div>
  );
}
