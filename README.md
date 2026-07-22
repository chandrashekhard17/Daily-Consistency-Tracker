# Daily Consistency Tracker

> **Tell me what I planned today, help me complete it, and show me whether I am becoming more consistent.**

**Daily Consistency Tracker** is a production-quality full-stack productivity web application built for daily task scheduling, habit tracking, consistency scoring, focus management, goals, and productivity analytics.

---

## Key Features

- 📅 **Today Dashboard**: Real-time progress, daily consistency score, streaks, focus timer, and upcoming chronological schedule linked to live database records.
- 📋 **Full Task CRUD**: Create, edit, complete, reopen, duplicate, archive, restore, and delete single & recurring tasks with subtask checklists and priority tags.
- 📁 **Category & Tag Management**: Create custom categories and tags with color palettes. Safe category deletion preserves task records.
- 🔍 **Search & Filter Bar**: Instant search by title/description/#tag, status filter, priority filter, category filter, date range filter, and sorting.
- ⏱️ **Time Blocking & Calendar**: Day, Week, Month, and Agenda views with conflict warnings and drag-and-drop rescheduling.
- 🔁 **Advanced Recurrence Engine**: Model recurring series independently from individual occurrences for safe history tracking and edits.
- 🌱 **Habit Tracking**: Track Yes/No, Quantitative, and Duration habits with custom target units and streaks.
- 🎯 **Goals & Milestones**: Link long-term goals to concrete actionable daily tasks.
- ⏳ **Pomodoro & Focus Timer**: Integrated focus sessions with persistence across page reloads and analytics.
- 📊 **Productivity Analytics**: Detailed charts for consistency trends, category performance, and automated weekly reviews.
- 🌗 **Light / Dark / System Mode**: Fully responsive modern UI built with Tailwind CSS and Radix UI primitives.

---

## Getting Started

### Database Setup (Supabase Migration)

Run the Phase 3 migration script against your Supabase instance:
```bash
supabase db push
# or execute supabase/migrations/20260722000000_phase3_task_management.sql via the Supabase SQL Editor
```

### Environment Variables
Copy `.env.example` to `.env.local` and set up your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Verification Commands
```bash
npm run lint          # ESLint static code analysis
npx tsc --noEmit      # Strict TypeScript typechecking
npm run build         # Production build test
```

---

## Documentation & Architecture

For in-depth domain schemas, RLS policies, ER diagrams, and consistency mathematical definitions, please consult [ARCHITECTURE.md](file:///c:/Users/chand/Downloads/Daily%20Status%20Tracker/ARCHITECTURE.md).
