"use client";

import React, { useState } from "react";
import { Tag } from "@/types";
import { TagFormValues, tagSchema } from "@/lib/validators/task";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Edit2, Trash2, Tag as TagIcon } from "lucide-react";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onCreateTag: (values: TagFormValues) => Promise<void>;
  onUpdateTag: (id: string, values: TagFormValues) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

export function TagModal({
  isOpen,
  onClose,
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagModalProps) {
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      color: "#10b981",
    },
  });

  if (!isOpen) return null;

  const selectedColor = watch("color");

  const startEdit = (tg: Tag) => {
    setEditingTag(tg);
    setValue("name", tg.name);
    setValue("color", tg.color);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    reset({ name: "", color: "#10b981" });
  };

  const onSubmit = async (values: TagFormValues) => {
    try {
      setIsSubmitting(true);
      if (editingTag) {
        await onUpdateTag(editingTag.id, values);
      } else {
        await onCreateTag(values);
      }
      cancelEdit();
    } catch (err: any) {
      alert(err.message || "Failed to save tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Manage Tags</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Create / Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {editingTag ? `Edit "${editingTag.name}"` : "Create New Tag"}
            </h4>

            <div>
              <input
                type="text"
                placeholder="Tag label..."
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Color Accent
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setValue("color", hex)}
                    className={`h-6 w-6 rounded-full transition-transform ${
                      selectedColor === hex ? "scale-125 ring-2 ring-ring ring-offset-2" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {editingTag && (
                <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="accent" size="sm" disabled={isSubmitting} className="gap-1 font-semibold">
                <Plus className="h-4 w-4" />
                {editingTag ? "Update" : "Add Tag"}
              </Button>
            </div>
          </form>

          {/* Existing Tags List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Existing Tags ({tags.length})
            </h4>

            <div className="space-y-2">
              {tags.map((tg) => (
                <div
                  key={tg.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tg.color }} />
                    <span className="text-sm font-semibold text-foreground">#{tg.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(tg)}
                      title="Edit Tag"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteTag(tg.id)}
                      title="Delete Tag"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
