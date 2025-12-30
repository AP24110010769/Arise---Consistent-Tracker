import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Habit } from "@/types/habit";
import { getHabits } from "@/lib/storage";
import Header from "./Header";
import TodayView from "./TodayView";
import TasksView from "./TasksView";
import SettingsView from "./SettingsView";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("today");
  const [habits, setHabits] = useState<Habit[]>([]);

  const loadHabits = () => {
    if (user) {
      const userHabits = getHabits(user);
      setHabits(userHabits);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [user]);

  const renderView = () => {
    switch (activeView) {
      case "today":
        return <TodayView habits={habits} onHabitsChange={loadHabits} />;
      case "tasks":
        return <TasksView habits={habits} onHabitsChange={loadHabits} />;
      case "settings":
        return <SettingsView habitsCount={habits.length} />;
      default:
        return <TodayView habits={habits} onHabitsChange={loadHabits} />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header activeView={activeView} onViewChange={setActiveView} />
      <main className="container mx-auto px-4 py-6">{renderView()}</main>
    </div>
  );
};

export default Dashboard;
