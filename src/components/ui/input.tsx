import * as React from "react"

import { cn } from "../../utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-coffee-200 dark:border-coffee-600 bg-cream-50/50 dark:bg-coffee-900/60 px-4 py-2 text-sm text-coffee-900 dark:text-coffee-50 ring-offset-white dark:ring-offset-coffee-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-coffee-300 dark:placeholder:text-coffee-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-400 dark:focus-visible:ring-coffee-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }