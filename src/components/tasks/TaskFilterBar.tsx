"use client";

import React from "react";
import { TaskFilterValues } from "@/lib/validators/task";
import { Category, Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

interface TaskFilterBarProps {
  filters: TaskFilterValues;
  onFilterChange: (newFilters: TaskFilterValues) => void;
  categories: Category[];
  tags: Tag[];
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export function TaskFilterBar({
  filters,
  onFilterChange,
  categories,
  tags,
  viewMode,
  onViewModeChange,
}: TaskFilterBarProps) {
  return (
    <div className="space-y-4 bg-card border border-border p-4 rounded-2xl shadow-xs">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Global Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, notes, or #tag..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Sorting & Layout View Toggle */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Sort:
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="DUE_DATE">Due Date</option>
              <option value="PRIORITY">Priority</option>
              <option value="START_TIME">Start Time</option>
              <option value="TITLE">Alphabetical</option>
              <option value="CREATED_AT">Date Created</option>
            </select>
            <button
              onClick={() => onFilterChange({ ...filters, sortOrder: filters.sortOrder === "ASC" ? "DESC" : "ASC" })}
              className="px-2 py-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-bold"
              title="Toggle sort direction"
            >
              {filters.sortOrder === "ASC" ? "↑" : "↓"}
            </button>
          </div>

          <div className="flex items-center border border-border rounded-lg p-0.5 bg-secondary/30">
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => onViewModeChange("list")}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "ghost"}
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => onViewModeChange("grid")}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Date & Status Pills Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <Filter className="h-3 w-3" /> Quick Filter:
        </span>

        {/* Date Filter Pills */}
        {(["ALL", "TODAY", "UPCOMING", "OVERDUE"] as const).map((df) => (
          <button
            key={df}
            onClick={() => onFilterChange({ ...filters, dateFilter: df })}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
              filters.dateFilter === df
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {df}
          </button>
        ))}

        <div className="h-4 w-px bg-border mx-1" />

        {/* Category Select Filter */}
        <select
          value={filters.categoryId || "ALL"}
          onChange={(e) => onFilterChange({ ...filters, categoryId: e.target.value })}
          className="px-3 py-1 rounded-full border border-border bg-background text-xs font-semibold text-foreground focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || "ALL"}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as any })}
          className="px-3 py-1 rounded-full border border-border bg-background text-xs font-semibold text-foreground focus:outline-none"
        >
          <option value="ALL">All Priorities</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Show Archived Toggle */}
        <button
          onClick={() => onFilterChange({ ...filters, showArchived: !filters.showArchived })}
          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ml-auto ${
            filters.showArchived
              ? "bg-amber-500/15 text-amber-600 border-amber-500/30 font-bold"
              : "border-border text-muted-foreground hover:bg-secondary"
          }`}
        >
          {filters.showArchived ? "Viewing Archived" : "Show Archived"}
        </button>
      </div>
    </div>
  );
}
