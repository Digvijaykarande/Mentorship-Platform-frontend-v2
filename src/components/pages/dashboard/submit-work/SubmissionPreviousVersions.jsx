import { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SubmissionPreviousVersions({ pastVersions = [] }) {
  const [showVersions, setShowVersions] = useState(false);

  if (!pastVersions.length) return null;

  return (
    <div className="rounded-xl border">
      <Button
        variant="unstyled"
        type="button"
        onClick={() => setShowVersions((v) => !v)}
        aria-expanded={showVersions}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-medium"
      >
        <History className="h-4 w-4 text-muted-foreground" />
        Previous versions ({pastVersions.length})
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-muted-foreground transition-transform",
            showVersions && "rotate-180",
          )}
        />
      </Button>
      {showVersions && (
        <ul className="max-h-44 space-y-2 overflow-y-auto border-t px-3.5 py-3">
          {pastVersions.map((v) => (
            <li key={v.version} className="text-xs leading-5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{v.version}</span>
                <span className="text-muted-foreground">{v.date}</span>
                {v.status && (
                  <span className="ml-auto text-muted-foreground">{v.status}</span>
                )}
              </div>
              {v.changes && <p className="text-muted-foreground">{v.changes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
