import { User, Habit } from "@/types/habit";

const USERS_KEY = "habit_tracker_users";
const CURRENT_USER_KEY = "habit_tracker_current_user";
const HABITS_KEY = "habit_tracker_habits";

// User management
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): boolean => {
  const users = getUsers();
  if (users.find((u) => u.username === user.username)) {
    return false; // User already exists
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

export const validateUser = (username: string, password: string): boolean => {
  const users = getUsers();
  return users.some((u) => u.username === username && u.password === password);
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

export const setCurrentUser = (username: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, username);
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Habit management
export const getHabits = (username: string): Habit[] => {
  const habits = localStorage.getItem(`${HABITS_KEY}_${username}`);
  return habits ? JSON.parse(habits) : [];
};

export const saveHabits = (username: string, habits: Habit[]): void => {
  localStorage.setItem(`${HABITS_KEY}_${username}`, JSON.stringify(habits));
};

export const addHabit = (username: string, habit: Habit): void => {
  const habits = getHabits(username);
  habits.push(habit);
  saveHabits(username, habits);
};

export const updateHabit = (username: string, updatedHabit: Habit): void => {
  const habits = getHabits(username);
  const index = habits.findIndex((h) => h.id === updatedHabit.id);
  if (index !== -1) {
    habits[index] = updatedHabit;
    saveHabits(username, habits);
  }
};

export const deleteHabit = (username: string, habitId: string): void => {
  const habits = getHabits(username);
  const filtered = habits.filter((h) => h.id !== habitId);
  saveHabits(username, filtered);
};

export const toggleHabitCompletion = (
  username: string,
  habitId: string,
  date: string
): void => {
  const habits = getHabits(username);
  const habit = habits.find((h) => h.id === habitId);
  if (habit) {
    const dateIndex = habit.completedDates.indexOf(date);
    if (dateIndex === -1) {
      habit.completedDates.push(date);
    } else {
      habit.completedDates.splice(dateIndex, 1);
    }
    saveHabits(username, habits);
  }
};

// Stats helpers
export const getStreak = (habit: Habit): number => {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (habit.completedDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getLongestStreak = (habit: Habit): number => {
  if (habit.completedDates.length === 0) return 0;

  const sortedDates = [...habit.completedDates].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

export const getTotalCompletedDays = (habits: Habit[]): number => {
  const allDates = new Set<string>();
  habits.forEach((habit) => {
    habit.completedDates.forEach((date) => allDates.add(date));
  });
  return allDates.size;
};
