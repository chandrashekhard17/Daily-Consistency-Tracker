import { Tag } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { TagFormValues } from "../validators/task";

const STORAGE_KEY = "daily_consistency_tracker_tags";

const defaultTags: Tag[] = [
  { id: "tag-urgent", userId: "demo-user", name: "Urgent", color: "#ef4444" },
  { id: "tag-quick", userId: "demo-user", name: "Quick Win", color: "#10b981" },
  { id: "tag-deepwork", userId: "demo-user", name: "Deep Work", color: "#6366f1" },
  { id: "tag-meeting", userId: "demo-user", name: "Meeting", color: "#f59e0b" },
];

function getLocalTags(): Tag[] {
  if (typeof window === "undefined") return defaultTags;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTags));
    return defaultTags;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultTags;
  }
}

function saveLocalTags(tags: Tag[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  }
}

export async function getTags(): Promise<Tag[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from("tags").select("*").order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data.map((t) => ({
      id: t.id,
      userId: t.user_id,
      name: t.name,
      color: t.color,
    }));
  }

  return getLocalTags();
}

export async function createTag(values: TagFormValues): Promise<Tag> {
  if (isSupabaseConfigured()) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("tags")
      .insert({
        user_id: userId,
        name: values.name,
        color: values.color,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      color: data.color,
    };
  }

  const local = getLocalTags();
  const newTag: Tag = {
    id: `tag-${Date.now()}`,
    userId: "demo-user",
    name: values.name,
    color: values.color,
  };
  const updated = [...local, newTag];
  saveLocalTags(updated);
  return newTag;
}

export async function updateTag(id: string, values: TagFormValues): Promise<Tag> {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("tags")
      .update({
        name: values.name,
        color: values.color,
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
    };
  }

  const local = getLocalTags();
  const index = local.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Tag not found");

  const updatedTag = { ...local[index], ...values };
  local[index] = updatedTag;
  saveLocalTags(local);
  return updatedTag;
}

export async function deleteTag(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from("tags").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const local = getLocalTags();
  const updated = local.filter((t) => t.id !== id);
  saveLocalTags(updated);
}
