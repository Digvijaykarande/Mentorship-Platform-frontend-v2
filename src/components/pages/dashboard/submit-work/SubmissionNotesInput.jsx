"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SubmissionNotesInput({
  notes,
  setNotes,
  mode,
  changeNote,
  setChangeNote,
  clearError,
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="submission-notes">
          Note for your mentor{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="submission-notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything they should know before reviewing?"
        />
      </div>

      {mode !== "create" && (
        <div className="space-y-1.5">
          <Label htmlFor="submission-change-note">
            What changed in this version?{" "}
            <span className="font-normal text-muted-foreground">
              {mode === "revise" ? "(required)" : "(optional)"}
            </span>
          </Label>
          <Textarea
            id="submission-change-note"
            rows={2}
            value={changeNote}
            onChange={(e) => {
              setChangeNote(e.target.value);
              clearError();
            }}
            placeholder={
              mode === "revise"
                ? "e.g. Fixed mobile spacing and added validation messages"
                : "Leave empty and we will summarise it for you"
            }
          />
        </div>
      )}
    </>
  );
}
