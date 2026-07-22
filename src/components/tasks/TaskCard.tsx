"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Task, Category } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Calendar,
  MoreVertical,
  Edit2,
  Copy,
  Archive,
  RotateCcw,
  Trash2,
  Check,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { format, isToday, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onArchive: (task: Task) => void;
  onRestore?: (task: Task) => void;
  onDelete: (task: Task) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string, isCompleted: boolean) => void;
}

export function TaskCard({
  task,
  category,
  onToggleComplete,
  onEdit,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
}: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; openUpward: boolean }>({
    top: 0,
    left: 0,
    openUpward: false,
  });

  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    if (!showMenu && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 180; // Estimated max height of dropdown
      const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

      setMenuPosition({
        top: openUpward ? rect.top - menuHeight + window.scrollY : rect.bottom + window.scrollY + 4,
        left: Math.min(rect.right - 160 + window.scrollX, window.innerWidth - 170), // Align right edge to button
        openUpward,
      });
    }
    setShowMenu((prev) => !prev);
  };

  const isCompleted = task.status === "COMPLETED";
  const isArchived = task.status === "ARCHIVED";
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const isOverdue = !isCompleted && !isArchived && task.date < todayStr;

  const priorityBadgeVariants: Record<string, "default" | "warning" | "destructive" | "secondary"> = {
    LOW: "secondary",
    MEDIUM: "default",
    HIGH: "warning",
    URGENT: "destructive",
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    onDelete(task);
  };

  return (
    <>
      <Card
        className={`group relative transition-all duration-200 hover:shadow-md ${
          isCompleted
            ? "opacity-75 bg-card/60"
            : isOverdue
            ? "border-destructive/40 bg-destructive/5"
            : "hover:border-primary/40"
        }`}
      >
        {/* Priority accent strip on left border with rounded corners matching card */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-xl ${
            task.priority === "URGENT"
              ? "bg-destructive"
              : task.priority === "HIGH"
              ? "bg-amber-500"
              : task.priority === "MEDIUM"
              ? "bg-primary"
              : "bg-emerald-500"
          }`}
        />

        <CardContent className="p-4 pl-5">
          <div className="flex items-start justify-between gap-3">
            {/* Complete Toggle Button & Title */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => onToggleComplete(task)}
                className={`mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-accent text-accent-foreground border-accent scale-105"
                    : "border-border hover:border-primary bg-background"
                }`}
                title={isCompleted ? "Mark incomplete" : "Mark complete"}
              >
                {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </button>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    onClick={() => onEdit(task)}
                    className={`text-sm font-semibold tracking-tight cursor-pointer hover:text-primary transition-colors ${
                      isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <Badge variant={priorityBadgeVariants[task.priority]}>{task.priority}</Badge>

                  {category && (
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md text-white shadow-xs"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  )}
                </div>

                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                )}
              </div>
            </div>

            {/* Action Trigger Button */}
            <div className="shrink-0">
              <Button
                ref={triggerRef}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground opacity-70 group-hover:opacity-100"
                onClick={toggleMenu}
                aria-label="Task options menu"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subtasks Progress Bar */}
          {totalSubtasks > 0 && (
            <div className="mt-3 space-y-1.5 bg-secondary/30 p-2.5 rounded-xl border border-border/50">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Subtasks</span>
                <span>
                  {completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)
                </span>
              </div>
              <Progress value={subtaskProgress} className="h-1.5" />
            </div>
          )}

          {/* Metadata & Tag Pills */}
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`flex items-center gap-1 font-medium ${isOverdue ? "text-destructive font-semibold" : ""}`}>
                <Calendar className="h-3 w-3" />
                {isToday(parseISO(task.date)) ? "Today" : task.date}
                {task.startTime && ` at ${task.startTime}`}
              </span>

              {task.durationMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.durationMinutes}m
                </span>
              )}

              {task.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  {task.location}
                </span>
              )}
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {task.tags.map((tg) => (
                  <span
                    key={tg.id}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{ backgroundColor: `${tg.color}15`, color: tg.color, borderColor: `${tg.color}40` }}
                  >
                    #{tg.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* React Portal Dropdown Menu */}
      {mounted &&
        showMenu &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setShowMenu(false)}
            />
            <div
              style={{
                position: "absolute",
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
              className="z-50 w-44 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl py-1 text-xs font-medium animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2 font-medium"
              >
                <Edit2 className="h-3.5 w-3.5 text-primary" /> Edit Task
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onDuplicate(task);
                }}
                className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2 font-medium"
              >
                <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Duplicate
              </button>

              {!isArchived ? (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onArchive(task);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2 font-medium"
                >
                  <Archive className="h-3.5 w-3.5 text-amber-500" /> Archive Task
                </button>
              ) : (
                onRestore && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onRestore(task);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-emerald-500" /> Restore Task
                  </button>
                )
              )}

              <div className="my-1 border-t border-border" />

              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowDeleteConfirm(true);
                }}
                className="w-full px-3 py-2 text-left hover:bg-destructive/10 text-destructive flex items-center gap-2 font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Task
              </button>
            </div>
          </>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card text-card-foreground border border-border rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-10 w-10 rounded-full bg-destructive/15 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Delete Task?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-foreground bg-secondary/30 p-3 rounded-xl border border-border/50">
              &quot;{task.title}&quot;
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteConfirm}>
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
