"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Build positive habits with Yes/No, Quantitative, and Duration tracking.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-8">
        <CardContent className="space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Flame className="h-8 w-8 fill-current" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Habits & Streak Engine</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Habit CRUD, daily check-ins, current/best streak calculations, and target tracking are being integrated in Phase 5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
