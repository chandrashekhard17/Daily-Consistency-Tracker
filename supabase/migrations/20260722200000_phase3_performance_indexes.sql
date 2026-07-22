-- Phase 3 Performance Migration: Targeted Composite Indexes for Tasks Table (Idempotent & Safe)

-- Composite Index for User Tasks by Due Date (Used by Today Dashboard & Date Filters)
CREATE INDEX IF NOT EXISTS idx_tasks_user_due_date ON public.tasks(user_id, due_date);

-- Composite Index for User Tasks by Status (Used by Status Filters & Overdue Calculations)
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);

-- Composite Index for User Tasks by Archived State (Used by Active / Archived Task Filters)
CREATE INDEX IF NOT EXISTS idx_tasks_user_archived ON public.tasks(user_id, is_archived);

-- Composite Index for User Tasks by Category (Used by Category Filters)
CREATE INDEX IF NOT EXISTS idx_tasks_user_category ON public.tasks(user_id, category_id);
