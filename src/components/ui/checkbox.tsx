import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "../../utils/cn"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-md border border-coffee-300 dark:border-coffee-500 ring-offset-white dark:ring-offset-coffee-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-400 dark:focus-visible:ring-coffee-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-coffee-800 dark:data-[state=checked]:bg-coffee-600 data-[state=checked]:text-white data-[state=checked]:border-coffee-800 dark:data-[state=checked]:border-coffee-600 transition-colors bg-white dark:bg-coffee-900/60",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }