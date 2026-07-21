export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
}

export const siteConfig = {
  name: "Daily Consistency Tracker",
  shortName: "Consistency",
  description: "Plan, schedule, execute, track, and improve your daily consistency and focus.",
  version: "1.0.0",
  mainNav: [
    {
      title: "Today",
      href: "/",
      iconName: "LayoutDashboard",
    },
    {
      title: "Calendar",
      href: "/calendar",
      iconName: "Calendar",
    },
    {
      title: "Tasks",
      href: "/tasks",
      iconName: "CheckSquare",
    },
    {
      title: "Habits",
      href: "/habits",
      iconName: "Flame",
    },
    {
      title: "Goals",
      href: "/goals",
      iconName: "Target",
    },
    {
      title: "Focus",
      href: "/focus",
      iconName: "Timer",
    },
    {
      title: "Analytics",
      href: "/analytics",
      iconName: "BarChart3",
    },
    {
      title: "Settings",
      href: "/settings",
      iconName: "Settings",
    },
  ] as NavItem[],
};
