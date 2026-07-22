import { UserPreferences } from "@/types";
import { supabase, isSupabaseConfigured, isLocalMockEnabled } from "./supabase";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  userId: "default-user",
  timezone: "UTC",
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  timeFormat: "12H",
  weekStart: "MONDAY",
  theme: "SYSTEM",
  gamificationEnabled: true,
  pomodoroWorkMinutes: 25,
  pomodoroShortBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
};

async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) return session.user.id;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        return {
          id: userData.user.id,
          email: userData.user.email || "",
          fullName: userData.user.user_metadata?.full_name || userData.user.email?.split("@")[0] || "User",
        };
      }
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name || data.email?.split("@")[0] || "User",
      avatarUrl: data.avatar_url || undefined,
    };
  }

  if (isLocalMockEnabled()) {
    return {
      id: "local-user",
      email: "demo@example.com",
      fullName: "Demo User",
    };
  }

  return null;
}

export async function updateUserProfile(updates: { fullName?: string; avatarUrl?: string }): Promise<UserProfile> {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name || "User",
      avatarUrl: data.avatar_url || undefined,
    };
  }

  return {
    id: "local-user",
    email: "demo@example.com",
    fullName: updates.fullName || "Demo User",
  };
}

export async function getUserPreferences(): Promise<UserPreferences> {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (!userId) return DEFAULT_PREFERENCES;

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) return { ...DEFAULT_PREFERENCES, userId };

    return {
      userId: data.user_id,
      timezone: data.timezone,
      workingHoursStart: data.working_hours_start,
      workingHoursEnd: data.working_hours_end,
      timeFormat: data.time_format,
      weekStart: data.week_start,
      theme: data.theme,
      gamificationEnabled: data.gamification_enabled,
      pomodoroWorkMinutes: data.pomodoro_work_minutes,
      pomodoroShortBreakMinutes: data.pomodoro_short_break_minutes,
      pomodoroLongBreakMinutes: data.pomodoro_long_break_minutes,
    };
  }

  return DEFAULT_PREFERENCES;
}

export async function updateUserPreferences(preferences: UserPreferences): Promise<UserPreferences> {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("user_preferences")
      .upsert({
        user_id: userId,
        timezone: preferences.timezone,
        working_hours_start: preferences.workingHoursStart,
        working_hours_end: preferences.workingHoursEnd,
        time_format: preferences.timeFormat,
        week_start: preferences.weekStart,
        theme: preferences.theme,
        gamification_enabled: preferences.gamificationEnabled,
        pomodoro_work_minutes: preferences.pomodoroWorkMinutes,
        pomodoro_short_break_minutes: preferences.pomodoroShortBreakMinutes,
        pomodoro_long_break_minutes: preferences.pomodoroLongBreakMinutes,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      userId: data.user_id,
      timezone: data.timezone,
      workingHoursStart: data.working_hours_start,
      workingHoursEnd: data.working_hours_end,
      timeFormat: data.time_format,
      weekStart: data.week_start,
      theme: data.theme,
      gamificationEnabled: data.gamification_enabled,
      pomodoroWorkMinutes: data.pomodoro_work_minutes,
      pomodoroShortBreakMinutes: data.pomodoro_short_break_minutes,
      pomodoroLongBreakMinutes: data.pomodoro_long_break_minutes,
    };
  }

  return preferences;
}
