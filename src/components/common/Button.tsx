import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coffee-600 focus-visible:ring-offset-2 dark:focus-visible:ring-coffee-400 dark:focus-visible:ring-offset-coffee-900 disabled:opacity-50 disabled:pointer-events-none active:scale-95 gap-2";

    const variants = {
      primary:
        "bg-[#EAB308] text-coffee-950 hover:bg-[#FACC15] shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 hover:-translate-y-0.5 border border-transparent active:translate-y-0",
      secondary:
        "bg-coffee-800 dark:bg-coffee-600 text-cream-50 hover:bg-coffee-900 dark:hover:bg-coffee-500 shadow-md hover:shadow-xl dark:shadow-coffee-900/20 hover:-translate-y-0.5 border border-transparent",
      outline:
        "bg-transparent border-2 border-coffee-800 dark:border-coffee-400 text-coffee-900 dark:text-coffee-100 hover:bg-coffee-800 dark:hover:bg-coffee-400 hover:text-white dark:hover:text-coffee-900",
      ghost:
        "bg-transparent text-coffee-800 dark:text-coffee-300 hover:bg-coffee-100/50 dark:hover:bg-coffee-800 hover:text-coffee-900 dark:hover:text-white",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs uppercase tracking-wider",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-10 text-base font-semibold",
      icon: "h-9 w-9 p-0", // Added icon size support
    };

    const width = fullWidth ? "w-full" : "";

    // Handle size="icon" gracefully if not in types yet, or extend types
    const sizeClass = sizes[size as keyof typeof sizes] || sizes.md;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizeClass} ${width} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
