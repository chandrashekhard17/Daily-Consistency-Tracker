"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Task, Category, Tag } from "@/types";
import { TaskFormValues, CategoryFormValues, TagFormValues, TaskFilterValues } from "@/lib/validators/task";
import {
  getTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  duplicateTask,
  archiveTask,
  restoreTask,
  deleteTask,
} from "@/lib/db/tasks";
import {
  getCategories,
  createCategory,
  updateCategory,
  archiveCategory,
  deleteCategory,
} from "@/lib/db/categories";
import { getTags, createTag, updateTag, deleteTag } from "@/lib/db/tags";

import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskModal } from "@/components/tasks/TaskModal";
import { CategoryModal } from "@/components/tasks/CategoryModal";
import { TagModal } from "@/components/tasks/TagModal";
import { TaskFilterBar } from "@/components/tasks/TaskFilterBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Plus, FolderPlus, Tag as TagIcon, CheckSquare, AlertCircle, RefreshCw } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState<TaskFilterValues>({
    search: "",
    status: "ALL",
    priority: "ALL",
    categoryId: "ALL",
    tagId: "ALL",
    dateFilter: "ALL",
    sortBy: "DUE_DATE",
    sortOrder: "ASC",
    showArchived: false,
  });

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Load Data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedTasks, fetchedCategories, fetchedTags] = await Promise.all([
        getTasks(filters),
        getCategories(),
        getTags(),
      ]);
      setTasks(fetchedTasks);
      setCategories(fetchedCategories);
      setTags(fetchedTags);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Task Actions with Optimistic UI Updates
  const handleSaveTask = async (values: TaskFormValues) => {
    if (editingTask) {
      await updateTask(editingTask.id, values);
    } else {
      await createTask(values);
    }
    await loadData();
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";

    // Optimistic UI Update (Immediate response)
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      await toggleTaskStatus(task.id, newStatus);
    } catch (err) {
      // Rollback on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
    }
  };

  const handleDuplicateTask = async (task: Task) => {
    await duplicateTask(task.id);
    await loadData();
  };

  const handleArchiveTask = async (task: Task) => {
    // Optimistic Update: remove from active list
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await archiveTask(task.id);
    } catch {
      await loadData();
    }
  };

  const handleRestoreTask = async (task: Task) => {
    // Optimistic Update: remove from archived list
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await restoreTask(task.id);
    } catch {
      await loadData();
    }
  };

  const handleDeleteTask = async (task: Task) => {
    // Optimistic Update: remove immediately
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    try {
      await deleteTask(task.id);
    } catch {
      await loadData();
    }
  };

  // Category Actions
  const handleCreateCategory = async (values: CategoryFormValues) => {
    await createCategory(values);
    const updated = await getCategories();
    setCategories(updated);
  };

  const handleUpdateCategory = async (id: string, values: CategoryFormValues) => {
    await updateCategory(id, values);
    const updated = await getCategories();
    setCategories(updated);
  };

  const handleArchiveCategory = async (id: string) => {
    await archiveCategory(id);
    const updated = await getCategories();
    setCategories(updated);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    const updated = await getCategories();
    setCategories(updated);
  };

  // Tag Actions
  const handleCreateTag = async (values: TagFormValues) => {
    await createTag(values);
    const updated = await getTags();
    setTags(updated);
  };

  const handleUpdateTag = async (id: string, values: TagFormValues) => {
    await updateTag(id, values);
    const updated = await getTags();
    setTags(updated);
  };

  const handleDeleteTag = async (id: string) => {
    await deleteTag(id);
    const updated = await getTags();
    setTags(updated);
  };

  const categoryMap = React.useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Main Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Task Management</h1>
          <p className="text-sm text-muted-foreground">
            Schedule, track, prioritize, and complete your tasks cleanly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setIsCategoryModalOpen(true)} className="gap-1.5 text-xs">
            <FolderPlus className="h-4 w-4" /> Categories
          </Button>

          <Button variant="outline" size="sm" onClick={() => setIsTagModalOpen(true)} className="gap-1.5 text-xs">
            <TagIcon className="h-4 w-4" /> Tags
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="gap-2 font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        </div>
      </div>

      {/* Search & Filtering Bar */}
      <TaskFilterBar
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        tags={tags}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={loadData} className="gap-1 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-secondary/40 animate-pulse border border-border/40" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <Card className="min-h-[350px] flex items-center justify-center text-center p-8 border-dashed">
          <CardContent className="space-y-3 max-w-sm">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <CheckSquare className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No tasks found</h3>
            <p className="text-sm text-muted-foreground">
              {filters.search || filters.dateFilter !== "ALL"
                ? "No tasks match your filter criteria. Try adjusting your filters."
                : "Your task list is empty. Click 'Create Task' to start organizing your day!"}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="gap-2 mt-2"
            >
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Task Cards List / Grid */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              category={t.categoryId ? categoryMap.get(t.categoryId) : undefined}
              onToggleComplete={handleToggleComplete}
              onEdit={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDuplicate={handleDuplicateTask}
              onArchive={handleArchiveTask}
              onRestore={handleRestoreTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
        tags={tags}
      />

      {/* Category Management Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onArchiveCategory={handleArchiveCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Tag Management Modal */}
      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tags={tags}
        onCreateTag={handleCreateTag}
        onUpdateTag={handleUpdateTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
}
