import { z } from "zod";

export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const statusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "SKIPPED",
  "MISSED",
  "RESCHEDULED",
  "ARCHIVED",
]);

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  icon: z.string().optional().default("Folder"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(30, "Tag too long"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
});

export type TagFormValues = z.infer<typeof tagSchema>;

export const subtaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Subtask title cannot be empty"),
  isCompleted: z.boolean().default(false),
  position: z.number().default(0),
});

export type SubtaskFormValues = z.infer<typeof subtaskSchema>;

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(120, "Title too long"),
  description: z.string().optional().default(""),
  dueDate: z.string().min(1, "Due date is required"),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute").default(30),
  isAllDay: z.boolean().default(false),
  priority: priorityEnum.default("MEDIUM"),
  status: statusEnum.default("TODO"),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
  subtasks: z.array(subtaskSchema).default([]),
  notes: z.string().optional().default(""),
  url: z.string().url("Invalid URL format").or(z.literal("")).optional().nullable(),
  location: z.string().optional().default(""),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const taskFilterSchema = z.object({
  search: z.string().optional(),
  status: statusEnum.optional().or(z.literal("ALL")),
  priority: priorityEnum.optional().or(z.literal("ALL")),
  categoryId: z.string().optional().or(z.literal("ALL")),
  tagId: z.string().optional().or(z.literal("ALL")),
  dateFilter: z.enum(["ALL", "TODAY", "UPCOMING", "OVERDUE", "CUSTOM"]).default("ALL"),
  customDate: z.string().optional(),
  sortBy: z.enum(["DUE_DATE", "START_TIME", "PRIORITY", "CREATED_AT", "TITLE"]).default("DUE_DATE"),
  sortOrder: z.enum(["ASC", "DESC"]).default("ASC"),
  showArchived: z.boolean().default(false),
});

export type TaskFilterValues = z.infer<typeof taskFilterSchema>;
