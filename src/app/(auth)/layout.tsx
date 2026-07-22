import React from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto z-10">
        <BrandLogo />
        <ThemeToggle />
      </header>

      {/* Auth Content Card Container */}
      <main className="flex-1 flex items-center justify-center my-8 z-10 w-full max-w-md mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground z-10">
        Daily Consistency Tracker &copy; {new Date().getFullYear()} • Secure Auth System
      </footer>
    </div>
  );
}
