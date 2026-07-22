"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Check,
} from "lucide-react";
import Link from "next/link";
import { getTodaySummaryMetrics, toggleTaskStatus, createTask } from "@/lib/db/tasks";
import { getCategories } from "@/lib/db/categories";
import { Task, Category } from "@/types";
import { TaskModal } from "@/components/tasks/TaskModal";
import { format } from "date-fns";

export default function TodayDashboardPage() {
  const [metrics, setMetrics] = useState<{
    todayTasks: Task[];
    totalToday: number;
    completedToday: number;
    remainingToday: number;
    overdueCount: number;
    overdueTasks: Task[];
    completionPercentage: number;
  }>({
    todayTasks: [],
    totalToday: 0,
    completedToday: 0,
    remainingToday: 0,
    overdueCount: 0,
    overdueTasks: [],
    completionPercentage: 100,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const consistencyScore = 88;
  const currentStreak = 7;
  const focusMinutes = 50;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [summary, cats] = await Promise.all([getTodaySummaryMetrics(), getCategories()]);
      setMetrics(summary);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";
    await toggleTaskStatus(taskId, nextStatus);
    await loadData();
  };

  const handleSaveQuickTask = async (values: any) => {
    await createTask(values);
    await loadData();
  };

  const categoryMap = React.useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back!
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Here is your real-time daily focus plan. You are on a{" "}
            <span className="font-semibold text-accent">{currentStreak}-day streak</span>!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsQuickAddOpen(true)}
            className="gap-1.5 font-semibold"
          >
            <Plus className="h-4 w-4" /> Quick Task
          </Button>
          <Link href="/focus">
            <Button variant="accent" size="sm" className="gap-2 shadow-sm font-semibold">
              <Play className="h-4 w-4 fill-current" />
              Start Focus Session
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Consistency Score */}
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

        {/* Current Streak */}
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

        {/* Tasks Completed Today */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tasks Completed
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">
                  {metrics.completedToday}
                </span>
                <span className="text-xs text-muted-foreground">/ {metrics.totalToday}</span>
              </div>
              <Progress value={metrics.completionPercentage} className="h-1.5 w-24 mt-2" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Focus Time */}
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

      {/* Main Today Dashboard View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Tasks Alert */}
          {metrics.overdueCount > 0 && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {metrics.overdueCount} Overdue Task{metrics.overdueCount > 1 ? "s" : ""}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Reschedule overdue tasks to protect your daily streak score.
                    </p>
                  </div>
                </div>
                <Link href="/tasks">
                  <Button variant="outline" size="sm" className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                    Manage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Today's Tasks List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Today&apos;s Schedule</CardTitle>
                <CardDescription>
                  {format(new Date(), "EEEE, MMMM d")} • {metrics.remainingToday} task{metrics.remainingToday === 1 ? "" : "s"} remaining
                </CardDescription>
              </div>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  All Tasks <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((n) => (
                    <div key={n} className="h-16 rounded-xl bg-secondary/50 animate-pulse" />
                  ))}
                </div>
              ) : metrics.todayTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm space-y-2">
                  <p>No tasks scheduled for today.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsQuickAddOpen(true)}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Schedule a Task
                  </Button>
                </div>
              ) : (
                metrics.todayTasks.map((task) => {
                  const cat = task.categoryId ? categoryMap.get(task.categoryId) : undefined;
                  const isDone = task.status === "COMPLETED";

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                        isDone
                          ? "border-border/50 bg-secondary/20"
                          : "border-border bg-card hover:bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <button
                          onClick={() => handleToggleTask(task.id, task.status)}
                          className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                            isDone
                              ? "bg-accent text-accent-foreground border-accent"
                              : "border-border hover:border-primary bg-background"
                          }`}
                        >
                          {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-sm font-semibold truncate ${
                                isDone ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {task.title}
                            </h4>
                            <Badge variant={task.priority === "URGENT" ? "destructive" : "secondary"}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {task.startTime ? `At ${task.startTime}` : "All Day"}{" "}
                            {cat && `• ${cat.name}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Today's Habits Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Today&apos;s Habits</CardTitle>
                <CardDescription>Daily consistency check-ins</CardDescription>
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

      {/* Quick Task Creation Modal */}
      <TaskModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSave={handleSaveQuickTask}
        categories={categories}
        tags={[]}
      />
    </div>
  );
}
