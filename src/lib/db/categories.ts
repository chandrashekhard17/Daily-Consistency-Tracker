import { Category } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { CategoryFormValues } from "../validators/task";

const STORAGE_KEY = "daily_consistency_tracker_categories";

const defaultCategories: Category[] = [
  { id: "cat-work", userId: "demo-user", name: "Work", color: "#4f46e5", icon: "Briefcase", isArchived: false },
  { id: "cat-study", userId: "demo-user", name: "Study", color: "#0284c7", icon: "BookOpen", isArchived: false },
  { id: "cat-fitness", userId: "demo-user", name: "Fitness", color: "#16a34a", icon: "Dumbbell", isArchived: false },
  { id: "cat-health", userId: "demo-user", name: "Health", color: "#059669", icon: "HeartPulse", isArchived: false },
  { id: "cat-personal", userId: "demo-user", name: "Personal", color: "#d97706", icon: "User", isArchived: false },
  { id: "cat-finance", userId: "demo-user", name: "Finance", color: "#2563eb", icon: "Wallet", isArchived: false },
  { id: "cat-learning", userId: "demo-user", name: "Learning", color: "#9333ea", icon: "GraduationCap", isArchived: false },
  { id: "cat-projects", userId: "demo-user", name: "Projects", color: "#dc2626", icon: "FolderKanban", isArchived: false },
];

function getLocalCategories(): Category[] {
  if (typeof window === "undefined") return defaultCategories;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultCategories;
  }
}

function saveLocalCategories(categories: Category[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_archived", false)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map((c) => ({
      id: c.id,
      userId: c.user_id,
      name: c.name,
      color: c.color,
      icon: c.icon,
      isArchived: c.is_archived,
    }));
  }

  return getLocalCategories().filter((c) => !c.isArchived);
}

export async function createCategory(values: CategoryFormValues): Promise<Category> {
  if (isSupabaseConfigured()) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: userId,
        name: values.name,
        color: values.color,
        icon: values.icon,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      color: data.color,
      icon: data.icon,
      isArchived: data.is_archived,
    };
  }

  const local = getLocalCategories();
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    userId: "demo-user",
    name: values.name,
    color: values.color,
    icon: values.icon,
    isArchived: false,
  };
  const updated = [...local, newCat];
  saveLocalCategories(updated);
  return newCat;
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<Category> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("categories")
      .update({
        name: values.name,
        color: values.color,
        icon: values.icon,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      color: data.color,
      icon: data.icon,
      isArchived: data.is_archived,
    };
  }

  const local = getLocalCategories();
  const index = local.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Category not found");

  const updatedCat = { ...local[index], ...values };
  local[index] = updatedCat;
  saveLocalCategories(local);
  return updatedCat;
}

export async function archiveCategory(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from("categories")
      .update({ is_archived: true })
      .eq("id", id);

    if (error) throw new Error(error.message);
    return;
  }

  const local = getLocalCategories();
  const updated = local.map((c) => (c.id === id ? { ...c, isArchived: true } : c));
  saveLocalCategories(updated);
}

export async function deleteCategory(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    // Note: Database ON DELETE SET NULL is enforced on tasks table, preserving user tasks safely
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const local = getLocalCategories();
  const updated = local.filter((c) => c.id !== id);
  saveLocalCategories(updated);
}
