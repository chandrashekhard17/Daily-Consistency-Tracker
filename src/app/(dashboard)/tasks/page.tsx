"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage single and recurring tasks, subtasks, priorities, and categories.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-8">
        <CardContent className="space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Task CRUD & Organization</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Full task filtering, sorting, priority tagging, subtask management, and status updates are being integrated in Phase 3.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
