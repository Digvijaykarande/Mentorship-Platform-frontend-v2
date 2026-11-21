import { useRef, useState } from "react";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const MAX_FILE_MB = 25;
const MAX_FILE_SIZE = MAX_FILE_MB * 1024 * 1024;

const formatSize = (bytes) => {
  if (!bytes) return "";
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export default function SubmissionFileUpload({ files, setFiles, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selected) => {
    if (!selected?.length) return;
    const incoming = Array.from(selected);
    const valid = incoming.filter((f) => f.size <= MAX_FILE_SIZE);
    if (onError) {
      onError(
        valid.length < incoming.length
          ? `Some files were over ${MAX_FILE_MB} MB and were skipped.`
          : "",
      );
    }
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      const fresh = valid
        .filter((f) => !names.has(f.name))
        .map((f) => ({ name: f.name, size: f.size, file: f }));
      return [...prev, ...fresh];
    });
  };

  const removeFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <Label>
        Files <span className="font-normal text-muted-foreground">(optional)</span>
      </Label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-4 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isDragging
            ? "border-primary bg-primary/5"
            : "hover:border-primary/50 hover:bg-muted/40",
        )}
      >
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => {
            handleFileSelect(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        <UploadCloud className="h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="text-sm">
          <p className="font-medium">Drop files here or browse</p>
          <p className="text-xs text-muted-foreground">Up to {MAX_FILE_MB} MB each</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">{file.name}</span>
                {file.size ? (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
