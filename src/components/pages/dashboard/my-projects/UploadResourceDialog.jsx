"use client";

import { FilePlus, Loader2, UploadCloud } from "lucide-react";
import AttachmentPicker from "@/components/common/AttachmentPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "picture_as_pdf", label: "PDF Specification / Brief" },
  { value: "draw", label: "Figma / Design Specs" },
  { value: "database", label: "Database Schema / Migration" },
  { value: "terminal", label: "Code Script / CLI Utility" },
];

export default function UploadResourceDialog({
  open,
  onOpenChange,
  form,
  onFormChange,
  items,
  onItemsChange,
  onSubmit,
  busy = false,
  error = "",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-bold">
            <FilePlus className="h-4.5 w-4.5 text-primary-600" />
            Upload Internship Asset
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold">
              Document / Asset Title <span className="font-normal text-slate-400">(optional, one file only)</span>
            </Label>
            <Input
              placeholder="e.g. Module 2 Deliverable Architecture.pdf"
              value={form.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold">Asset Category</Label>
            <Select
              value={form.category}
              onValueChange={(val) => onFormChange("category", val)}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AttachmentPicker items={items} onChange={onItemsChange} disabled={busy} compact />

          {error && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={busy || !items.length}
              className="gap-1.5"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
              {busy ? "Uploading…" : "Upload Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
