"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Flame,
  Target,
  Timer,
  BarChart3,
  Settings,
} from "lucide-react";
import { clsx } from "clsx";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Flame,
  Target,
  Timer,
  BarChart3,
  Settings,
};

export function MobileNav() {
  const pathname = usePathname();

  // Show top 5 primary items in bottom bar, overflow to settings
  const primaryItems = siteConfig.mainNav.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border px-2 py-2 flex items-center justify-around">
      {primaryItems.map((item) => {
        const Icon = iconMap[item.iconName] || LayoutDashboard;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors",
              isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={clsx("h-5 w-5", isActive && "scale-110")} />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
