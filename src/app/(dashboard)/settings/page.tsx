"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserPreferences } from "@/types";
import {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
} from "@/lib/db/userPreferences";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  User,
  Clock,
  Globe,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState("");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const [prof, prefs] = await Promise.all([getUserProfile(), getUserPreferences()]);
        if (prof) setFullName(prof.fullName);
        setPreferences(prefs);
      } catch (err) {
        console.error("Failed to load user settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (fullName.trim()) {
        await updateUserProfile({ fullName: fullName.trim() });
        await refreshProfile();
      }

      if (preferences) {
        await updateUserPreferences(preferences);
      }

      setMessage({ type: "success", text: "Settings and preferences saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((n) => (
          <div key={n} className="h-44 rounded-2xl bg-secondary/40 animate-pulse border border-border/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account profile, working hours, timezone, and interface preferences.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Profile Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || profile?.email || "Local User"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground text-sm font-medium cursor-not-allowed"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        {preferences && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Time & Regional Preferences
              </CardTitle>
              <CardDescription>Configure working hours, time format, and timezone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Timezone */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="Europe/London">London (GMT / BST)</option>
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                {/* Week Start */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Week Start Day
                  </label>
                  <select
                    value={preferences.weekStart}
                    onChange={(e) =>
                      setPreferences({ ...preferences, weekStart: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="MONDAY">Monday</option>
                    <option value="SUNDAY">Sunday</option>
                  </select>
                </div>

                {/* Working Hours Start */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Working Hours Start
                  </label>
                  <input
                    type="time"
                    value={preferences.workingHoursStart}
                    onChange={(e) => setPreferences({ ...preferences, workingHoursStart: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Working Hours End */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Working Hours End
                  </label>
                  <input
                    type="time"
                    value={preferences.workingHoursEnd}
                    onChange={(e) => setPreferences({ ...preferences, workingHoursEnd: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Theme Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" /> Appearance Theme
            </CardTitle>
            <CardDescription>Select your preferred visual interface style</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "light", label: "Light", icon: Sun },
                { key: "dark", label: "Dark", icon: Moon },
                { key: "system", label: "System", icon: Laptop },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setTheme(key);
                    if (preferences) {
                      setPreferences({ ...preferences, theme: key.toUpperCase() as any });
                    }
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 font-semibold text-xs transition-all ${
                    theme === key
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" size="lg" disabled={saving} className="gap-2 font-semibold shadow-md min-w-[140px]">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
}
