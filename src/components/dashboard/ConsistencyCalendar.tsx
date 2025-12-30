import React, { useState } from "react";
import { Habit } from "@/types/habit";
import { useAuth } from "@/contexts/AuthContext";
import { toggleHabitCompletion } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

interface ConsistencyCalendarProps {
  habit: Habit;
  onUpdate: () => void;
}

const ConsistencyCalendar: React.FC<ConsistencyCalendarProps> = ({
  habit,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    if (!user) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    toggleHabitCompletion(user, habit.id, dateStr);
    onUpdate();
  };

  const isCompleted = (day: number): boolean => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return habit.completedDates.includes(dateStr);
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isFuture = (day: number): boolean => {
    const today = new Date();
    const dateToCheck = new Date(year, month, day);
    return dateToCheck > today;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="space-y-4">
      {/* Habit Info */}
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: habit.color }}
        />
        <span className="font-medium text-foreground">{habit.name}</span>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-display font-semibold text-foreground">
          {monthName} {year}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const completed = isCompleted(day);
          const today = isToday(day);
          const future = isFuture(day);

          return (
            <button
              key={day}
              onClick={() => !future && handleDayClick(day)}
              disabled={future}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                completed
                  ? "bg-success text-success-foreground"
                  : future
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "hover:bg-accent text-foreground"
              } ${today ? "ring-2 ring-primary ring-offset-2" : ""}`}
            >
              {completed ? (
                <Check className="w-4 h-4" />
              ) : future ? (
                day
              ) : (
                day
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success flex items-center justify-center">
            <Check className="w-3 h-3 text-success-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/10 flex items-center justify-center">
            <X className="w-3 h-3 text-destructive" />
          </div>
          <span className="text-xs text-muted-foreground">Missed</span>
        </div>
      </div>
    </div>
  );
};

export default ConsistencyCalendar;
