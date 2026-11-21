"use client"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"
function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-unchecked:bg-slate-300 dark:data-unchecked:bg-slate-700/80 data-checked:bg-blue-600 dark:data-checked:bg-blue-600 aria-checked:bg-blue-600 dark:aria-checked:bg-blue-600 shadow-xs",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 data-checked:translate-x-5 aria-checked:translate-x-5 data-unchecked:translate-x-0 translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}
export { Switch }
