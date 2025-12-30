export interface User {
  username: string;
  password: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  completedDates: string[]; // Array of date strings (YYYY-MM-DD)
  color: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}
