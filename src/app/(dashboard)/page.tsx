"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  Flame,
  AlertCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function TodayDashboardPage() {
  const consistencyScore = 88;
  const currentStreak = 7;
  const completedTasksCount = 5;
  const totalTasksCount = 8;
  const overdueCount = 1;
  const focusMinutes = 50;
  const completionPercentage = Math.round((completedTasksCount / totalTasksCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, Alex!
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Here is your daily focus plan. You are on a <span className="font-semibold text-accent">{currentStreak}-day streak</span>!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="accent" className="gap-2 shadow-sm font-semibold">
            <Play className="h-4 w-4 fill-current" />
            Start Focus Session
          </Button>
        </div>
      </div>

      {/* KPI Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Consistency Score Card */}
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Consistency Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary">{consistencyScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
              <p className="text-[11px] text-accent flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" /> +4% from yesterday
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Daily Streak Card */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Current Streak
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">{currentStreak}</span>
                <span className="text-xs text-muted-foreground">days</span>
              </div>
              <p className="text-[11px] text-amber-500 font-medium">Best: 14 days</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Flame className="h-6 w-6 fill-current" />
            </div>
          </CardContent>
        </Card>

        {/* Task Completion Card */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tasks Completed
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">{completedTasksCount}</span>
                <span className="text-xs text-muted-foreground">/ {totalTasksCount}</span>
              </div>
              <Progress value={completionPercentage} className="h-1.5 w-24 mt-2" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Focus Time Logged Card */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Focus Time
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">{focusMinutes}</span>
                <span className="text-xs text-muted-foreground">mins</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">Goal: 90 mins</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Today View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2-Column Section: Schedule & Urgent Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue / Urgent Alert Section */}
          {overdueCount > 0 && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {overdueCount} Overdue Task Requiring Attention
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Review or reschedule overdue items to protect your streak.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                  Reschedule
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Today's Chronological Schedule Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Today&apos;s Schedule</CardTitle>
                <CardDescription>Chronological timeline of scheduled activities</CardDescription>
              </div>
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  Full View <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-3 rounded-xl border border-border bg-card/60 hover:bg-card transition-colors">
                  <div className="text-xs font-semibold text-muted-foreground w-16 pt-0.5">
                    09:00 AM
                  </div>
                  <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold line-through text-muted-foreground">
                        Morning Code Review & Architecture Sync
                      </h4>
                      <Badge variant="accent">Completed</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">45 mins • Work</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="text-xs font-semibold text-primary w-16 pt-0.5">
                    11:30 AM
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 animate-pulse" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">
                        Implement Recurrence Engine & Domain Models
                      </h4>
                      <Badge variant="default">In Progress</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">90 mins • Engineering</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl border border-border bg-card/60 hover:bg-card transition-colors">
                  <div className="text-xs font-semibold text-muted-foreground w-16 pt-0.5">
                    03:00 PM
                  </div>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">
                        Read 30 Minutes (Habit)
                      </h4>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">30 mins • Habits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1-Column Section: Habit Check-ins */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Today&apos;s Habits</CardTitle>
                <CardDescription>Check in daily to build consistency</CardDescription>
              </div>
              <Link href="/habits">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Morning Workout</h5>
                    <p className="text-[11px] text-muted-foreground">Target: 30 mins</p>
                  </div>
                </div>
                <Badge variant="accent">Done</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-foreground">Drink 3L Water</h5>
                    <p className="text-[11px] text-muted-foreground">Target: 3 liters</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Check in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
