import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { Zap } from "lucide-react";

export function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group focus:outline-none">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md group-hover:scale-105 transition-transform duration-200">
        <Zap className="h-5 w-5 fill-current" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
            {siteConfig.name}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Consistency Platform
          </span>
        </div>
      )}
    </Link>
  );
}
