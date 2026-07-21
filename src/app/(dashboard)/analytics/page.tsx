"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productivity Analytics & Weekly Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Analyze task completion trends, habit consistency, focus hours, and weekly performance reviews.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-8">
        <CardContent className="space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Interactive Analytics & Weekly Review</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Recharts analytics, category performance charts, missed task reasons breakdown, and automated weekly reviews are being integrated in Phase 8.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
