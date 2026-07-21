import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 - 100
  colorClassName?: string;
}

export function Progress({ className, value = 0, colorClassName, ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div
      className={twMerge(clsx("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className))}
      {...props}
    >
      <div
        className={twMerge(clsx("h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out", colorClassName))}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
