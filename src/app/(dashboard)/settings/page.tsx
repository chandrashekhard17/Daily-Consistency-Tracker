"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings & Preferences</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, timezone, working hours, notification preferences, and themes.
          </p>
        </div>
      </div>

      <Card className="min-h-[400px] flex items-center justify-center text-center p-8">
        <CardContent className="space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Settings className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">User Preferences & Account Settings</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Timezone configuration, working hours selection, notification preferences, and data export features are being integrated in Phase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
