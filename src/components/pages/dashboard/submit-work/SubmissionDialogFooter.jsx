"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

export default function SubmissionDialogFooter({
  noChanges,
  base,
  finalVersion,
  versionText,
  onClose,
  ActionIcon,
  actionText,
}) {
  return (
    <DialogFooter className="mx-0 mb-0 shrink-0">
      <span className="text-xs text-muted-foreground sm:mr-auto sm:self-center">
        {noChanges ? (
          "No changes yet"
        ) : base?.version ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="font-mono" title="Previous version">
              {base.version}
            </span>
            <ArrowRight className="h-3 w-3" />
            <span
              className="font-mono font-semibold text-foreground"
              title="New version"
            >
              {finalVersion ?? versionText}
            </span>
          </span>
        ) : (
          <>
            Saves as{" "}
            <span className="font-mono font-semibold text-foreground">
              {finalVersion ?? versionText}
            </span>
          </>
        )}
      </span>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" className="gap-2" disabled={noChanges}>
        <ActionIcon className="h-4 w-4" /> {actionText}
      </Button>
    </DialogFooter>
  );
}
