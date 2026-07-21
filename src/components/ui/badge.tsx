import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "accent" | "destructive" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            "bg-primary/10 text-primary border border-primary/20": variant === "default",
            "bg-secondary text-secondary-foreground border border-secondary": variant === "secondary",
            "border border-border text-foreground": variant === "outline",
            "bg-accent/15 text-accent border border-accent/30": variant === "accent",
            "bg-destructive/15 text-destructive border border-destructive/30": variant === "destructive",
            "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30": variant === "warning",
          },
          className
        )
      )}
      {...props}
    />
  );
}
