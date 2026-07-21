"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Flame,
  Target,
  Timer,
  BarChart3,
  Settings,
  ChevronRight,
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

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-md h-screen sticky top-0 z-30 select-none">
      {/* Sidebar Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border/50">
        <BrandLogo />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {siteConfig.mainNav.map((item) => {
          const Icon = iconMap[item.iconName] || LayoutDashboard;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={clsx("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground leading-none">Demo User</span>
            <span className="text-[10px] text-muted-foreground">Pro Member</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
