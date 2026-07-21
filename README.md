# Daily Consistency Tracker

> **Tell me what I planned today, help me complete it, and show me whether I am becoming more consistent.**

**Daily Consistency Tracker** is a production-quality full-stack productivity web application built for daily task scheduling, habit tracking, consistency scoring, focus management, goals, and productivity analytics.

---

## Key Features

- 📅 **Today Dashboard**: Real-time progress, daily consistency score, streaks, focus timer, and upcoming chronological schedule.
- ⏱️ **Time Blocking & Calendar**: Day, Week, Month, and Agenda views with conflict warnings and drag-and-drop rescheduling.
- 🔁 **Advanced Recurrence Engine**: Model recurring series independently from individual occurrences for safe history tracking and edits.
- 🌱 **Habit Tracking**: Track Yes/No, Quantitative, and Duration habits with custom target units and streaks.
- 🎯 **Goals & Milestones**: Link long-term goals to concrete actionable daily tasks.
- ⏳ **Pomodoro & Focus Timer**: Integrated focus sessions with persistence across page reloads and analytics.
- 📊 **Productivity Analytics**: Detailed charts for consistency trends, category performance, and automated weekly reviews.
- 🎮 **Gamification (Optional)**: Earn XP, unlock levels, and gain badges for consistency milestones.
- 🌗 **Light / Dark / System Mode**: Fully responsive modern UI built with Tailwind CSS and Radix UI primitives.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v24.x supported)
- **npm**: v9.0.0 or higher
- **Git**: Installed

### Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   git init
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and set up your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Verification Commands**
   ```bash
   npm run lint          # ESLint static code analysis
   npx tsc --noEmit      # Strict TypeScript typechecking
   npm run build         # Production build test
   ```

---

## Project Structure

```
.
├── ARCHITECTURE.md          # Complete technical design & schema docs
├── IMPLEMENTATION_PLAN.md   # Phased implementation progress tracker
├── README.md                # Overview & quick start guide
├── src/
│   ├── app/                 # Next.js App Router routes & pages
│   ├── components/          # Reusable UI & feature components
│   ├── lib/                 # Utilities, config, db services, validators
│   └── types/               # TypeScript domain interfaces
```

---

## Documentation & Architecture

For in-depth domain schemas, ER diagrams, and consistency mathematical definitions, please consult [ARCHITECTURE.md](file:///c:/Users/chand/Downloads/Daily%20Status%20Tracker/ARCHITECTURE.md).
