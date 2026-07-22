"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/lib/validators/task";
import { Task, Category, Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag as TagIcon,
  Folder,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  MapPin,
} from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: TaskFormValues) => Promise<void>;
  task?: Task | null;
  categories: Category[];
  tags: Tag[];
}

export function TaskModal({ isOpen, onClose, onSave, task, categories, tags }: TaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialValues: TaskFormValues = useMemo(
    () => ({
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.date || format(new Date(), "yyyy-MM-dd"),
      startTime: task?.startTime || "",
      endTime: task?.endTime || "",
      durationMinutes: task?.durationMinutes || 30,
      isAllDay: task?.isAllDay || false,
      priority: task?.priority || "MEDIUM",
      status: task?.status || "TODO",
      categoryId: task?.categoryId || "",
      tagIds: task?.tags ? task.tags.map((t) => t.id) : [],
      subtasks: task?.subtasks
        ? task.subtasks.map((s) => ({ title: s.title, isCompleted: s.isCompleted, position: s.order }))
        : [],
      notes: task?.notes || "",
      url: task?.url || "",
      location: task?.location || "",
    }),
    [task]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      reset(initialValues);
      setErrorMsg(null);
    }
  }, [isOpen, initialValues, reset]);

  if (!isOpen) return null;

  const selectedPriority = watch("priority");
  const selectedTagIds = watch("tagIds") || [];

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    append({ title: newSubtaskTitle.trim(), isCompleted: false, position: fields.length });
    setNewSubtaskTitle("");
  };

  const toggleTagSelection = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setValue(
        "tagIds",
        selectedTagIds.filter((id) => id !== tagId)
      );
    } else {
      setValue("tagIds", [...selectedTagIds, tagId]);
    }
  };

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await onSave(data);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
          <h2 className="text-lg font-bold text-foreground">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Complete Phase 3 task management engine"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Add extra context or objectives..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              {...register("description")}
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5 text-primary" /> Category
              </label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("categoryId")}
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setValue("priority", p)}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                      selectedPriority === p
                        ? p === "URGENT"
                          ? "bg-destructive text-destructive-foreground border-destructive"
                          : p === "HIGH"
                          ? "bg-amber-500 text-white border-amber-500"
                          : p === "MEDIUM"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-emerald-500 text-white border-emerald-500"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date, Time & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Due Date *
              </label>
              <input
                type="date"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("dueDate")}
              />
              {errors.dueDate && <p className="text-xs text-destructive mt-1">{errors.dueDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> Start Time
              </label>
              <input
                type="time"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("startTime")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Duration (Mins)
              </label>
              <input
                type="number"
                min={5}
                max={480}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("durationMinutes", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Tags Selection */}
          {tags.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5 text-primary" /> Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTagSelection(tag.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all flex items-center gap-1 ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtasks Checklist */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Subtasks Checklist
            </label>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    {...register(`subtasks.${index}.isCompleted`)}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    {...register(`subtasks.${index}.title`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSubtask} className="gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          {/* Optional Meta (URL & Location) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/60 pt-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" /> URL / Reference Link
              </label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                {...register("url")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Location
              </label>
              <input
                type="text"
                placeholder="e.g. Conference Room A or Home Office"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                {...register("location")}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[100px]">
              {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
