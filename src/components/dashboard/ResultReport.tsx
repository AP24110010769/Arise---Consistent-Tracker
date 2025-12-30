import React from "react";
import { Habit } from "@/types/habit";
import { getStreak, getLongestStreak } from "@/lib/storage";
import { Flame, Trophy, Calendar, Target, TrendingUp } from "lucide-react";

interface ResultReportProps {
  habit: Habit;
}

const ResultReport: React.FC<ResultReportProps> = ({ habit }) => {
  const currentStreak = getStreak(habit);
  const longestStreak = getLongestStreak(habit);
  const totalDays = habit.completedDates.length;

  // Calculate days since creation
  const createdDate = new Date(habit.createdAt);
  const today = new Date();
  const daysSinceCreation = Math.floor(
    (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const completionRate =
    daysSinceCreation > 0
      ? Math.round((totalDays / daysSinceCreation) * 100)
      : 0;

  // Calculate this week's completions
  const getThisWeekCompletions = (): number => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return habit.completedDates.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= startOfWeek;
    }).length;
  };

  // Calculate this month's completions
  const getThisMonthCompletions = (): number => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return habit.completedDates.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= startOfMonth;
    }).length;
  };

  const thisWeek = getThisWeekCompletions();
  const thisMonth = getThisMonthCompletions();

  return (
    <div className="space-y-6">
      {/* Habit Info */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: habit.color }}
        />
        <div>
          <h3 className="font-display font-semibold text-foreground">
            {habit.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Started {createdDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Main Stats - Large Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/5 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Flame className="w-6 h-6 text-primary" />
          </div>
          <p className="text-4xl font-bold text-foreground">{longestStreak}</p>
          <p className="text-sm text-muted-foreground mt-1">Longest Streak</p>
        </div>
        <div className="bg-success/5 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-success" />
          </div>
          <p className="text-4xl font-bold text-foreground">{totalDays}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Total No. of Tasks Completed Days
          </p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-accent rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            Completion Rate
          </span>
          <span className="text-lg font-bold text-primary">{completionRate}%</span>
        </div>
        <div className="h-3 bg-border rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <TrendingUp className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-xl font-bold text-foreground">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Current</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Target className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xl font-bold text-foreground">{thisWeek}</p>
          <p className="text-xs text-muted-foreground">This Week</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Trophy className="w-5 h-5 text-success mx-auto mb-1" />
          <p className="text-xl font-bold text-foreground">{thisMonth}</p>
          <p className="text-xs text-muted-foreground">This Month</p>
        </div>
      </div>
    </div>
  );
};

export default ResultReport;
