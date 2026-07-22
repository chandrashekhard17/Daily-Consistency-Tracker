import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="h-24 rounded-2xl bg-secondary/40 border border-border/40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-28 rounded-2xl bg-secondary/40 border border-border/40" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 rounded-2xl bg-secondary/40 border border-border/40" />
        </div>
        <div className="h-64 rounded-2xl bg-secondary/40 border border-border/40" />
      </div>
    </div>
  );
}
