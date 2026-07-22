"use client";

import React from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Plus, Bell, LogOut, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function Header() {
  const todayFormatted = format(new Date(), "EEEE, MMMM d, yyyy");
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.fullName || user?.email?.split("@")[0] || "User";

  return (
    <header className="h-16 border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left branding on mobile */}
      <div className="flex items-center gap-3 lg:hidden">
        <BrandLogo collapsed />
      </div>

      {/* Date & Title Greeting */}
      <div className="hidden sm:flex flex-col">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {todayFormatted}
        </h2>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2.5 ml-auto">
        <Link href="/tasks">
          <Button size="sm" className="gap-2 shadow-sm font-semibold">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Task</span>
          </Button>
        </Link>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="w-9 h-9 text-muted-foreground relative" title="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* Mobile Sign Out */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-destructive hover:bg-destructive/10 lg:hidden"
            onClick={() => signOut()}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}

        {/* Mobile Theme Toggle */}
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
