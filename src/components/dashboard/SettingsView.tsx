import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Sparkles, Shield, Database } from "lucide-react";
import { toast } from "sonner";

interface SettingsViewProps {
  habitsCount: number;
}

const SettingsView: React.FC<SettingsViewProps> = ({ habitsCount }) => {
  const { user, logout } = useAuth();

  const handleClearData = () => {
    if (user) {
      localStorage.removeItem(`habit_tracker_habits_${user}`);
      toast.success("All habits cleared");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <User className="w-5 h-5 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-2xl font-bold text-primary-foreground">
                {user?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user}</p>
              <p className="text-sm text-muted-foreground">
                {habitsCount} active habits
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Sparkles className="w-5 h-5 text-primary" />
            About Arise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Arise is a simple and beautiful habit tracker that helps you build
            better habits and track your progress over time.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Data stored locally</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="w-4 h-4" />
              <span>No account needed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="shadow-card border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive font-display">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/10">
            <div>
              <p className="font-medium text-foreground">Clear All Habits</p>
              <p className="text-sm text-muted-foreground">
                This will delete all your habits and progress
              </p>
            </div>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleClearData}
            >
              Clear Data
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div>
              <p className="font-medium text-foreground">Logout</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;
