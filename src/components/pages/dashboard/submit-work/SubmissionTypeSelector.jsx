import { Code, FileText, FlaskConical, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SUBMISSION_TYPES } from "./constants";

const TYPE_ICONS = {
  "Source Code": Code,
  Documentation: FileText,
  "Design Artifacts": Palette,
  "QA & Testing": FlaskConical,
};

export default function SubmissionTypeSelector({ type, setType }) {
  return (
    <div className="space-y-1.5">
      <Label>What are you submitting?</Label>
      <div role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SUBMISSION_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t.value];
          const active = t.value === type;
          return (
            <Button
              variant="unstyled"
              key={t.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setType(t.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary/5 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.short}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
