export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SKIPPED"
  | "MISSED"
  | "RESCHEDULED"
  | "ARCHIVED";

export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";
export type HabitType = "YES_NO" | "QUANTITY" | "DURATION";
export type GoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
export type ThemePreference = "LIGHT" | "DARK" | "SYSTEM";
export type WeekStart = "SUNDAY" | "MONDAY";
export type TimeFormat = "12H" | "24H";

export interface UserPreferences {
  userId: string;
  timezone: string;
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string;   // "17:00"
  timeFormat: TimeFormat;
  weekStart: WeekStart;
  theme: ThemePreference;
  gamificationEnabled: boolean;
  pomodoroWorkMinutes: number;
  pomodoroShortBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  isArchived: boolean;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  order: number;
}

export interface Task {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  durationMinutes: number;
  isAllDay: boolean;
  priority: Priority;
  status: TaskStatus;
  recurrenceRuleId?: string;
  subtasks: Subtask[];
  tags: Tag[];
  notes?: string;
  location?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  categoryId?: string;
  name: string;
  description?: string;
  type: HabitType;
  targetValue: number;
  targetUnit: string;
  frequency: "DAILY" | "WEEKLY";
  preferredTime?: string;
  startDate: string;
  currentStreak: number;
  bestStreak: number;
  isArchived: boolean;
}

export interface HabitCheckIn {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  value: number;
  isCompleted: boolean;
  notes?: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetDate?: string;
  isCompleted: boolean;
  orderIndex: number;
}

export interface Goal {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  description?: string;
  startDate: string;
  targetDate: string;
  status: GoalStatus;
  progressPercentage: number;
  milestones: Milestone[];
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  startedAt: string;
  endedAt?: string;
  status: "COMPLETED" | "INTERRUPTED" | "ABANDONED";
}

export interface DailySummary {
  date: string;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  skippedTasks: number;
  habitCompletionRate: number;
  focusMinutes: number;
  consistencyScore: number;
  streakDays: number;
}
