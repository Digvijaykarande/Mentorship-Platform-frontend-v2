import * as React from "react"
import { cn } from "@/lib/utils"
const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-slate-400 dark:focus:border-slate-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-slate-400 dark:focus-visible:border-slate-500 active:outline-none active:ring-0 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-0 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
        className
      )}
      {...props}
    />
  )
})
export { Textarea }
