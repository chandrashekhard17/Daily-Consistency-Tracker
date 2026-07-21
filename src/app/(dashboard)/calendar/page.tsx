"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar & Scheduling</h1>
          <p className="text-sm text-muted-foreground">
            View day, week, month schedules and time-block your daily activities.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-8">
        <CardContent className="space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CalendarIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Interactive Scheduling Engine</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Day, Week, Month, Agenda calendar views and daily time-blocking timeline are being integrated in Phase 4.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
