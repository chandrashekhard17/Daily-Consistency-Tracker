"use client";

import React, { useState } from "react";
import { Category } from "@/types";
import { CategoryFormValues, categorySchema } from "@/lib/validators/task";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus, Edit2, Archive, Trash2, Folder } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreateCategory: (values: CategoryFormValues) => Promise<void>;
  onUpdateCategory: (id: string, values: CategoryFormValues) => Promise<void>;
  onArchiveCategory: (id: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  "#4f46e5",
  "#0284c7",
  "#16a34a",
  "#059669",
  "#d97706",
  "#2563eb",
  "#9333ea",
  "#dc2626",
  "#e11d48",
  "#0891b2",
];

export function CategoryModal({
  isOpen,
  onClose,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onArchiveCategory,
  onDeleteCategory,
}: CategoryModalProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      color: "#4f46e5",
      icon: "Folder",
    },
  });

  if (!isOpen) return null;

  const selectedColor = watch("color");

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setValue("name", cat.name);
    setValue("color", cat.color);
    setValue("icon", cat.icon || "Folder");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    reset({ name: "", color: "#4f46e5", icon: "Folder" });
  };

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await onUpdateCategory(editingCategory.id, values);
      } else {
        await onCreateCategory(values);
      }
      cancelEdit();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Manage Categories</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Create / Edit Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {editingCategory ? `Edit "${editingCategory.name}"` : "Create New Category"}
            </h4>

            <div>
              <input
                type="text"
                placeholder="Category name..."
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            {/* Color Palette Selector */}
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
              {editingCategory && (
                <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="gap-1">
                <Plus className="h-4 w-4" />
                {editingCategory ? "Update" : "Add Category"}
              </Button>
            </div>
          </form>

          {/* List of Existing Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Existing Categories ({categories.length})
            </h4>

            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(cat)}
                      title="Edit Category"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-amber-500"
                      onClick={() => onArchiveCategory(cat.id)}
                      title="Archive Category"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteCategory(cat.id)}
                      title="Delete Category safely"
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
