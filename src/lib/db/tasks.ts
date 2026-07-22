import { Task, TaskStatus, Subtask, Tag } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { TaskFormValues, TaskFilterValues } from "../validators/task";
import { format, isBefore, isToday, parseISO, startOfDay } from "date-fns";

const STORAGE_KEY = "daily_consistency_tracker_tasks";

const defaultSampleTasks: Task[] = [
  {
    id: "task-1",
    userId: "demo-user",
    categoryId: "cat-work",
    title: "Morning Code Review & Architecture Sync",
    description: "Review outstanding PRs and align on Phase 3 Task Management implementation.",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "09:45",
    durationMinutes: 45,
    isAllDay: false,
    priority: "HIGH",
    status: "COMPLETED",
    subtasks: [
      { id: "sub-1", taskId: "task-1", title: "Review PR #42", isCompleted: true, order: 0 },
      { id: "sub-2", taskId: "task-1", title: "Check test coverage", isCompleted: true, order: 1 },
    ],
    tags: [{ id: "tag-deepwork", userId: "demo-user", name: "Deep Work", color: "#6366f1" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    userId: "demo-user",
    categoryId: "cat-work",
    title: "Implement Recurrence Engine & Domain Models",
    description: "Build robust recurring task calculator and Supabase migrations.",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "11:30",
    endTime: "13:00",
    durationMinutes: 90,
    isAllDay: false,
    priority: "URGENT",
    status: "IN_PROGRESS",
    subtasks: [
      { id: "sub-3", taskId: "task-2", title: "Create tasks table migration", isCompleted: true, order: 0 },
      { id: "sub-4", taskId: "task-2", title: "Build Task CRUD forms", isCompleted: false, order: 1 },
      { id: "sub-5", taskId: "task-2", title: "Add subtasks checklist", isCompleted: false, order: 2 },
    ],
    tags: [{ id: "tag-urgent", userId: "demo-user", name: "Urgent", color: "#ef4444" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    userId: "demo-user",
    categoryId: "cat-fitness",
    title: "Evening Workout & Hydration Check",
    description: "30 mins core workout + track 3L water intake.",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "17:30",
    endTime: "18:00",
    durationMinutes: 30,
    isAllDay: false,
    priority: "MEDIUM",
    status: "TODO",
    subtasks: [],
    tags: [{ id: "tag-quick", userId: "demo-user", name: "Quick Win", color: "#10b981" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getLocalTasks(): Task[] {
  if (typeof window === "undefined") return defaultSampleTasks;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSampleTasks));
    return defaultSampleTasks;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultSampleTasks;
  }
}

function saveLocalTasks(tasks: Task[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

export async function getTasks(filter?: Partial<TaskFilterValues>): Promise<Task[]> {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  if (isSupabaseConfigured()) {
    let query = supabase
      .from("tasks")
      .select(`
        *,
        subtasks (*),
        task_tags (
          tags (*)
        )
      `);

    if (!filter?.showArchived) {
      query = query.eq("is_archived", false);
    } else {
      query = query.eq("is_archived", true);
    }

    if (filter?.status && filter.status !== "ALL") {
      query = query.eq("status", filter.status);
    }

    if (filter?.priority && filter.priority !== "ALL") {
      query = query.eq("priority", filter.priority);
    }

    if (filter?.categoryId && filter.categoryId !== "ALL") {
      query = query.eq("category_id", filter.categoryId);
    }

    if (filter?.dateFilter === "TODAY") {
      query = query.eq("due_date", todayStr);
    } else if (filter?.dateFilter === "OVERDUE") {
      query = query.lt("due_date", todayStr).neq("status", "COMPLETED");
    } else if (filter?.dateFilter === "UPCOMING") {
      query = query.gt("due_date", todayStr);
    } else if (filter?.dateFilter === "CUSTOM" && filter.customDate) {
      query = query.eq("due_date", filter.customDate);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    let result: Task[] = data.map((t) => ({
      id: t.id,
      userId: t.user_id,
      categoryId: t.category_id,
      title: t.title,
      description: t.description || "",
      date: t.due_date,
      startTime: t.start_time || undefined,
      endTime: t.end_time || undefined,
      durationMinutes: t.duration_minutes || 30,
      isAllDay: t.is_all_day || false,
      priority: t.priority,
      status: t.status,
      notes: t.notes || "",
      url: t.url || "",
      location: t.location || "",
      subtasks: (t.subtasks || []).map((s: any) => ({
        id: s.id,
        taskId: s.task_id,
        title: s.title,
        isCompleted: s.is_completed,
        order: s.position,
      })),
      tags: (t.task_tags || [])
        .map((tt: any) => tt.tags)
        .filter(Boolean)
        .map((tg: any) => ({
          id: tg.id,
          userId: tg.user_id,
          name: tg.name,
          color: tg.color,
        })),
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

    // Client-side search filtering if specified
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.tags.some((tg) => tg.name.toLowerCase().includes(q))
      );
    }

    // Client-side sorting
    return sortTasks(result, filter?.sortBy || "DUE_DATE", filter?.sortOrder || "ASC");
  }

  // Local Storage Fallback Mode
  let tasks = getLocalTasks();

  if (!filter?.showArchived) {
    tasks = tasks.filter((t) => t.status !== "ARCHIVED");
  } else {
    tasks = tasks.filter((t) => t.status === "ARCHIVED");
  }

  if (filter?.status && filter.status !== "ALL") {
    tasks = tasks.filter((t) => t.status === filter.status);
  }

  if (filter?.priority && filter.priority !== "ALL") {
    tasks = tasks.filter((t) => t.priority === filter.priority);
  }

  if (filter?.categoryId && filter.categoryId !== "ALL") {
    tasks = tasks.filter((t) => t.categoryId === filter.categoryId);
  }

  if (filter?.tagId && filter.tagId !== "ALL") {
    tasks = tasks.filter((t) => t.tags.some((tg) => tg.id === filter.tagId));
  }

  if (filter?.dateFilter === "TODAY") {
    tasks = tasks.filter((t) => t.date === todayStr);
  } else if (filter?.dateFilter === "OVERDUE") {
    tasks = tasks.filter((t) => t.date < todayStr && t.status !== "COMPLETED");
  } else if (filter?.dateFilter === "UPCOMING") {
    tasks = tasks.filter((t) => t.date > todayStr);
  } else if (filter?.dateFilter === "CUSTOM" && filter.customDate) {
    tasks = tasks.filter((t) => t.date === filter.customDate);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.tags.some((tg) => tg.name.toLowerCase().includes(q))
    );
  }

  return sortTasks(tasks, filter?.sortBy || "DUE_DATE", filter?.sortOrder || "ASC");
}

function sortTasks(tasks: Task[], sortBy: string, sortOrder: "ASC" | "DESC"): Task[] {
  const priorityMap = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

  return [...tasks].sort((a, b) => {
    let comp = 0;
    if (sortBy === "DUE_DATE") {
      comp = a.date.localeCompare(b.date);
    } else if (sortBy === "START_TIME") {
      comp = (a.startTime || "23:59").localeCompare(b.startTime || "23:59");
    } else if (sortBy === "PRIORITY") {
      comp = (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
    } else if (sortBy === "TITLE") {
      comp = a.title.localeCompare(b.title);
    } else {
      comp = a.createdAt.localeCompare(b.createdAt);
    }

    return sortOrder === "DESC" ? -comp : comp;
  });
}

export async function createTask(values: TaskFormValues): Promise<Task> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        category_id: values.categoryId || null,
        title: values.title,
        description: values.description,
        due_date: values.dueDate,
        start_time: values.startTime || null,
        end_time: values.endTime || null,
        duration_minutes: values.durationMinutes,
        is_all_day: values.isAllDay,
        priority: values.priority,
        status: values.status,
        notes: values.notes,
        url: values.url || null,
        location: values.location,
      })
      .select()
      .single();

    if (taskError) throw new Error(taskError.message);

    // Insert Task Tags
    if (values.tagIds.length > 0) {
      const taskTagRows = values.tagIds.map((tagId) => ({
        task_id: taskData.id,
        tag_id: tagId,
        user_id: userId,
      }));
      await supabase.from("task_tags").insert(taskTagRows);
    }

    // Insert Subtasks
    if (values.subtasks.length > 0) {
      const subtaskRows = values.subtasks.map((s, idx) => ({
        task_id: taskData.id,
        user_id: userId,
        title: s.title,
        is_completed: s.isCompleted,
        position: idx,
      }));
      await supabase.from("subtasks").insert(subtaskRows);
    }

    return getTaskById(taskData.id);
  }

  // Local fallback
  const local = getLocalTasks();
  const taskId = `task-${Date.now()}`;
  const newTask: Task = {
    id: taskId,
    userId: "demo-user",
    categoryId: values.categoryId || undefined,
    title: values.title,
    description: values.description,
    date: values.dueDate,
    startTime: values.startTime || undefined,
    endTime: values.endTime || undefined,
    durationMinutes: values.durationMinutes,
    isAllDay: values.isAllDay,
    priority: values.priority,
    status: values.status,
    notes: values.notes,
    url: values.url || undefined,
    location: values.location,
    subtasks: values.subtasks.map((s, idx) => ({
      id: `sub-${Date.now()}-${idx}`,
      taskId,
      title: s.title,
      isCompleted: s.isCompleted,
      order: idx,
    })),
    tags: [],
    createdAt: now,
    updatedAt: now,
  };

  saveLocalTasks([newTask, ...local]);
  return newTask;
}

export async function getTaskById(id: string): Promise<Task> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        subtasks (*),
        task_tags (
          tags (*)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description || "",
      date: data.due_date,
      startTime: data.start_time || undefined,
      endTime: data.end_time || undefined,
      durationMinutes: data.duration_minutes || 30,
      isAllDay: data.is_all_day || false,
      priority: data.priority,
      status: data.status,
      notes: data.notes || "",
      url: data.url || "",
      location: data.location || "",
      subtasks: (data.subtasks || []).map((s: any) => ({
        id: s.id,
        taskId: s.task_id,
        title: s.title,
        isCompleted: s.is_completed,
        order: s.position,
      })),
      tags: (data.task_tags || [])
        .map((tt: any) => tt.tags)
        .filter(Boolean)
        .map((tg: any) => ({
          id: tg.id,
          userId: tg.user_id,
          name: tg.name,
          color: tg.color,
        })),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  const local = getLocalTasks();
  const task = local.find((t) => t.id === id);
  if (!task) throw new Error("Task not found");
  return task;
}

export async function updateTask(id: string, values: TaskFormValues): Promise<Task> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const { error: taskError } = await supabase
      .from("tasks")
      .update({
        category_id: values.categoryId || null,
        title: values.title,
        description: values.description,
        due_date: values.dueDate,
        start_time: values.startTime || null,
        end_time: values.endTime || null,
        duration_minutes: values.durationMinutes,
        is_all_day: values.isAllDay,
        priority: values.priority,
        status: values.status,
        notes: values.notes,
        url: values.url || null,
        location: values.location,
      })
      .eq("id", id);

    if (taskError) throw new Error(taskError.message);

    // Sync tags
    await supabase.from("task_tags").delete().eq("task_id", id);
    if (values.tagIds.length > 0) {
      const { data: userData } = await supabase.auth.getUser();
      const taskTagRows = values.tagIds.map((tagId) => ({
        task_id: id,
        tag_id: tagId,
        user_id: userData.user?.id!,
      }));
      await supabase.from("task_tags").insert(taskTagRows);
    }

    return getTaskById(id);
  }

  // Local update
  const local = getLocalTasks();
  const index = local.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");

  const updatedTask: Task = {
    ...local[index],
    title: values.title,
    description: values.description,
    date: values.dueDate,
    startTime: values.startTime || undefined,
    endTime: values.endTime || undefined,
    durationMinutes: values.durationMinutes,
    isAllDay: values.isAllDay,
    priority: values.priority,
    status: values.status,
    categoryId: values.categoryId || undefined,
    notes: values.notes,
    url: values.url || undefined,
    location: values.location,
    updatedAt: now,
  };

  local[index] = updatedTask;
  saveLocalTasks(local);
  return updatedTask;
}

export async function toggleTaskStatus(id: string, newStatus: TaskStatus): Promise<Task> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) throw new Error(error.message);
    return getTaskById(id);
  }

  const local = getLocalTasks();
  const index = local.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");

  local[index].status = newStatus;
  local[index].updatedAt = new Date().toISOString();
  saveLocalTasks(local);
  return local[index];
}

export async function archiveTask(id: string): Promise<void> {
  return toggleTaskStatus(id, "ARCHIVED").then(() => undefined);
}

export async function restoreTask(id: string): Promise<void> {
  return toggleTaskStatus(id, "TODO").then(() => undefined);
}

export async function duplicateTask(id: string): Promise<Task> {
  const existing = await getTaskById(id);
  const formValues: TaskFormValues = {
    title: `${existing.title} (Copy)`,
    description: existing.description || "",
    dueDate: existing.date,
    startTime: existing.startTime,
    endTime: existing.endTime,
    durationMinutes: existing.durationMinutes,
    isAllDay: existing.isAllDay,
    priority: existing.priority,
    status: "TODO",
    categoryId: existing.categoryId,
    tagIds: existing.tags.map((t) => t.id),
    subtasks: existing.subtasks.map((s) => ({ title: s.title, isCompleted: false, position: s.order })),
    notes: existing.notes || "",
    url: existing.url || "",
    location: existing.location || "",
  };

  return createTask(formValues);
}

export async function deleteTask(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const local = getLocalTasks();
  const updated = local.filter((t) => t.id !== id);
  saveLocalTasks(updated);
}

export async function toggleSubtask(taskId: string, subtaskId: string, isCompleted: boolean): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from("subtasks")
      .update({ is_completed: isCompleted })
      .eq("id", subtaskId);

    if (error) throw new Error(error.message);
    return;
  }

  const local = getLocalTasks();
  const task = local.find((t) => t.id === taskId);
  if (task) {
    const sub = task.subtasks.find((s) => s.id === subtaskId);
    if (sub) {
      sub.isCompleted = isCompleted;
      saveLocalTasks(local);
    }
  }
}

export async function getTodaySummaryMetrics() {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tasks = await getTasks({ showArchived: false });

  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const completedToday = todayTasks.filter((t) => t.status === "COMPLETED").length;
  const totalToday = todayTasks.length;
  const overdueTasks = tasks.filter((t) => t.date < todayStr && t.status !== "COMPLETED");

  const completionPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 100;

  return {
    todayTasks,
    totalToday,
    completedToday,
    remainingToday: totalToday - completedToday,
    overdueCount: overdueTasks.length,
    overdueTasks,
    completionPercentage,
  };
}
