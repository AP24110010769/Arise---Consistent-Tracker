import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Habit } from "@/types/habit";
import { deleteHabit, updateHabit, getStreak, getLongestStreak } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Calendar, Flame, Trophy, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import ConsistencyCalendar from "./ConsistencyCalendar";
import ResultReport from "./ResultReport";

interface TasksViewProps {
  habits: Habit[];
  onHabitsChange: () => void;
}

const TasksView: React.FC<TasksViewProps> = ({ habits, onHabitsChange }) => {
  const { user } = useAuth();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditName(habit.name);
  };

  const handleSaveEdit = () => {
    if (!user || !editingHabit || !editName.trim()) return;
    
    updateHabit(user, { ...editingHabit, name: editName.trim() });
    setEditingHabit(null);
    setEditName("");
    onHabitsChange();
    toast.success("Habit updated!");
  };

  const handleDelete = (habitId: string) => {
    if (!user) return;
    deleteHabit(user, habitId);
    onHabitsChange();
    toast.success("Habit deleted");
  };

  const openCalendar = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowCalendar(true);
  };

  const openReport = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowReport(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Your Tasks
          </h1>
          <p className="text-muted-foreground">
            Manage and track your habits
          </p>
        </div>
      </div>

      {habits.length === 0 ? (
        <Card className="shadow-card border-border/50">
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No habits yet
            </h3>
            <p className="text-muted-foreground">
              Go to Today view to add your first habit!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {habits.map((habit, index) => {
            const streak = getStreak(habit);
            const longestStreak = getLongestStreak(habit);

            return (
              <Card
                key={habit.id}
                className="shadow-card border-border/50 hover:shadow-lg transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: habit.color }}
                      />
                      <CardTitle className="text-lg font-display">
                        {habit.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(habit)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Habit</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Habit name"
                            />
                            <Button
                              onClick={handleSaveEdit}
                              className="w-full gradient-primary"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{habit.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(habit.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/5 border border-warning/10">
                      <Flame className="w-4 h-4 text-warning" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {streak}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Current Streak
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/10">
                      <Trophy className="w-4 h-4 text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {longestStreak}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Best Streak
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openCalendar(habit)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Calendar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openReport(habit)}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Consistency Calendar Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Consistency Calendar</DialogTitle>
          </DialogHeader>
          {selectedHabit && (
            <ConsistencyCalendar
              habit={selectedHabit}
              onUpdate={onHabitsChange}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Result Report Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Result Report</DialogTitle>
          </DialogHeader>
          {selectedHabit && <ResultReport habit={selectedHabit} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksView;
