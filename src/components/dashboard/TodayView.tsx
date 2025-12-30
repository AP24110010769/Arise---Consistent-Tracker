import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Habit } from "@/types/habit";
import { getHabits, toggleHabitCompletion, addHabit } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Target, Flame, Trophy } from "lucide-react";
import { toast } from "sonner";

interface TodayViewProps {
  habits: Habit[];
  onHabitsChange: () => void;
}

const TodayView: React.FC<TodayViewProps> = ({ habits, onHabitsChange }) => {
  const { user } = useAuth();
  const [newHabitName, setNewHabitName] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleAddQuickHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim() || !user) return;

    const colors = [
      "hsl(217, 91%, 60%)",
      "hsl(142, 76%, 36%)",
      "hsl(38, 92%, 50%)",
      "hsl(280, 87%, 65%)",
      "hsl(340, 82%, 52%)",
    ];

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      createdAt: today,
      completedDates: [],
      color: colors[habits.length % colors.length],
    };

    addHabit(user, newHabit);
    setNewHabitName("");
    onHabitsChange();
    toast.success("Habit added!");
  };

  const handleToggleHabit = (habitId: string) => {
    if (!user) return;
    toggleHabitCompletion(user, habitId, today);
    onHabitsChange();
  };

  const completedToday = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;
  const completionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  // Calculate current streak for each habit
  const getHabitStreak = (habit: Habit): number => {
    let streak = 0;
    let currentDate = new Date();
    
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Welcome, {user}!
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Quick Add */}
      <Card className="shadow-card border-border/50">
        <CardContent className="p-4">
          <form onSubmit={handleAddQuickHabit} className="flex gap-3">
            <Input
              placeholder="Add Your New Task"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="flex-1 h-11"
            />
            <Button
              type="submit"
              className="h-11 gradient-primary shadow-glow"
              disabled={!newHabitName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{habits.length}</p>
            <p className="text-xs text-muted-foreground">Total Habits</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">{completedToday}</p>
            <p className="text-xs text-muted-foreground">Done Today</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-warning" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Math.round(completionRate)}%
            </p>
            <p className="text-xs text-muted-foreground">Completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Habits */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-display">Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {habits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No habits yet. Add your first one above!</p>
            </div>
          ) : (
            habits.map((habit, index) => {
              const isCompleted = habit.completedDates.includes(today);
              const streak = getHabitStreak(habit);
              
              return (
                <div
                  key={habit.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    isCompleted
                      ? "bg-success/5 border-success/20"
                      : "bg-card border-border/50 hover:border-primary/30"
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleToggleHabit(habit.id)}
                    className={`w-6 h-6 rounded-lg ${
                      isCompleted ? "border-success bg-success" : ""
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        isCompleted
                          ? "text-success line-through"
                          : "text-foreground"
                      }`}
                    >
                      {habit.name}
                    </p>
                    {streak > 0 && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Flame className="w-3 h-3 text-warning" />
                        {streak} day streak
                      </p>
                    )}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodayView;
