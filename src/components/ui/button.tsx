import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
            {
              "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm": variant === "primary",
              "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
              "border border-border bg-transparent hover:bg-muted text-foreground": variant === "outline",
              "hover:bg-muted text-foreground": variant === "ghost",
              "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm": variant === "destructive",
              "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm": variant === "accent",
            },
            {
              "h-8 px-3 text-xs rounded-md": size === "sm",
              "h-10 px-4 text-sm rounded-lg": size === "md",
              "h-12 px-6 text-base rounded-xl": size === "lg",
              "h-10 w-10 p-0 rounded-lg": size === "icon",
            },
            className
          )
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
