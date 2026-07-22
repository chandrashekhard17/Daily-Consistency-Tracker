import { Tag } from "@/types";
import { supabase, isSupabaseConfigured, isLocalMockEnabled } from "./supabase";
import { TagFormValues } from "../validators/task";
import { getCachedData, setCachedData, invalidateCacheKey } from "./cache";

const STORAGE_KEY = "daily_consistency_tracker_tags";
const CACHE_KEY = "tags";

const defaultTags: Tag[] = [
  { id: "tag-urgent", userId: "local-user", name: "Urgent", color: "#ef4444" },
  { id: "tag-quick", userId: "local-user", name: "Quick Win", color: "#10b981" },
  { id: "tag-deepwork", userId: "local-user", name: "Deep Work", color: "#6366f1" },
  { id: "tag-meeting", userId: "local-user", name: "Meeting", color: "#f59e0b" },
];

async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) return session.user.id;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

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
    const userId = await getCurrentUserId();
    if (!userId) return [];

    const cached = getCachedData<Tag[]>(CACHE_KEY, userId);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    const tags: Tag[] = (data || []).map((t) => ({
      id: t.id,
      userId: t.user_id,
      name: t.name,
      color: t.color,
    }));

    setCachedData(CACHE_KEY, userId, tags);
    return tags;
  }

  if (!isLocalMockEnabled()) throw new Error("Supabase is not configured.");
  return getLocalTags();
}

export async function createTag(values: TagFormValues): Promise<Tag> {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Authentication required to create tag");

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

    invalidateCacheKey(CACHE_KEY);

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
    userId: "local-user",
    name: values.name,
    color: values.color,
  };
  const updated = [...local, newTag];
  saveLocalTags(updated);
  return newTag;
}

export async function updateTag(id: string, values: TagFormValues): Promise<Tag> {
  if (isSupabaseConfigured()) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Authentication required");

    const { data, error } = await supabase
      .from("tags")
      .update({
        name: values.name,
        color: values.color,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    invalidateCacheKey(CACHE_KEY);

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
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Authentication required");

    const { error } = await supabase
      .from("tags")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    invalidateCacheKey(CACHE_KEY);
    return;
  }

  const local = getLocalTags();
  const updated = local.filter((t) => t.id !== id);
  saveLocalTags(updated);
}
