import * as React from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-coffee-200 dark:border-coffee-700 bg-white dark:bg-coffee-800 px-3 py-2 text-sm text-coffee-900 dark:text-white placeholder:text-coffee-400 dark:placeholder:text-coffee-500 focus:outline-none focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
