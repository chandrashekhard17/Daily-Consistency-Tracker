"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Goals & Milestones</h1>
          <p className="text-sm text-muted-foreground">
            Deconstruct long-term goals into actionable milestones and linked tasks.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-8">
        <CardContent className="space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Target className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Goal Hierarchy Engine</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Goal tracking, milestone completion rates, and linked schedule tasks are being integrated in Phase 7.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
