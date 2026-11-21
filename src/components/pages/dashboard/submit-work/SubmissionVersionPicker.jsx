import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { INITIAL_VERSION, bumpVersion, isValidVersion, normalizeVersion } from "./submissionLogic";

export default function SubmissionVersionPicker({
  base,
  versionText,
  setVersionInput,
  finalVersion,
  versionError,
  clearError,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="submission-version">Version</Label>
      {base?.version && (
        <div role="radiogroup" className="grid grid-cols-3 gap-2">
          {[
            { kind: "major", label: "Major", hint: "Revision" },
            { kind: "minor", label: "Minor", hint: "Update" },
            { kind: "patch", label: "Patch", hint: "Small edit" },
          ].map((option) => {
            const value = bumpVersion(base.version, option.kind);
            const active = finalVersion === value;
            return (
              <Button
                variant="unstyled"
                key={option.kind}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setVersionInput(value)}
                className={cn(
                  "flex flex-col items-center rounded-xl border px-2 py-2 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <span className="font-medium">{option.label}</span>
                <span className="font-mono text-[11px]">{value}</span>
                <span className="text-[10px] opacity-70">{option.hint}</span>
              </Button>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          id="submission-version"
          value={versionText}
          onChange={(e) => {
            setVersionInput(e.target.value);
            clearError();
          }}
          onBlur={() => {
            if (isValidVersion(versionText)) setVersionInput(normalizeVersion(versionText));
          }}
          placeholder={INITIAL_VERSION}
          aria-invalid={Boolean(versionError)}
          className="w-32 font-mono"
        />
        <p
          className={cn(
            "text-xs",
            versionError ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground",
          )}
        >
          {versionError ||
            (base?.version
              ? "Pick a type or type your own version."
              : "First version of this work. Change it only if you need another number.")}
        </p>
      </div>
    </div>
  );
}
