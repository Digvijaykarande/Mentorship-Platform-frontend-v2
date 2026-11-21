"use client";

import { Link2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NO_TASK } from "./constants";

export default function SubmissionTaskAndLink({
  taskOptions = [],
  taskId,
  setTaskId,
  taskLocked,
  activeType,
  type,
  link,
  setLink,
  clearError,
}) {
  const LinkIcon = type === "Source Code" ? FaGithub : Link2;

  return (
    <>
      {taskOptions.length > 0 && (
        <div className="space-y-1.5">
          <Label>
            Related task{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Select value={taskId} onValueChange={setTaskId} disabled={taskLocked}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_TASK}>No specific task</SelectItem>
              {taskOptions.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.label ?? t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="submission-link">
          {activeType.linkLabel}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <div className="relative">
          <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="submission-link"
            type="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              clearError();
            }}
            placeholder={activeType.linkPlaceholder}
            className="pl-9"
          />
        </div>
        {activeType.linkHint && (
          <p className="text-xs text-muted-foreground">{activeType.linkHint}</p>
        )}
      </div>
    </>
  );
}
