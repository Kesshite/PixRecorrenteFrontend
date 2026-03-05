import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, target, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
      variant === "primary" &&
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-lg shadow-emerald-600/25 dark:bg-emerald-500 dark:hover:bg-emerald-600",
      variant === "secondary" &&
        "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 shadow-lg shadow-blue-500/25",
      variant === "outline" &&
        "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/50",
      size === "sm" && "px-4 py-2 text-sm",
      size === "md" && "px-6 py-3 text-base",
      size === "lg" && "px-8 py-4 text-lg",
      className
    );

    if (href) {
      return (
        <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
