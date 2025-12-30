import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (regPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    if (register(regUsername.trim(), regPassword)) {
      toast.success("Account created successfully!");
    } else {
      toast.error("Username already exists");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (login(loginUsername.trim(), loginPassword)) {
      toast.success("Welcome back!");
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Arise
          </h1>
          <p className="text-muted-foreground mt-2">
            Build better habits, one day at a time
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-card border-border/50">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="register" className="font-medium">
                  Register
                </TabsTrigger>
                <TabsTrigger value="login" className="font-medium">
                  Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Enter your username</Label>
                    <Input
                      id="reg-username"
                      type="text"
                      placeholder="Username"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Enter new password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="Password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 gradient-primary shadow-glow font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Enter your username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Enter your password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 gradient-primary shadow-glow font-medium">
                    Login
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
