"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";

export default function FocusPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Focus & Pomodoro</h1>
          <p className="text-sm text-muted-foreground">
            Run deep work focus sessions (25/5, 50/10, or custom duration) with task association.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-8">
        <CardContent className="space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <Timer className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Pomodoro Focus Timer</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Pomodoro timer, break cycles, timestamp-persisted countdowns, and session logs are being integrated in Phase 6.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
