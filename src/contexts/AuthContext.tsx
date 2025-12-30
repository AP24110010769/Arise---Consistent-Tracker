import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, setCurrentUser, logout as logoutStorage, validateUser, saveUser } from "@/lib/storage";

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (validateUser(username, password)) {
      setCurrentUser(username);
      setUser(username);
      return true;
    }
    return false;
  };

  const register = (username: string, password: string): boolean => {
    if (saveUser({ username, password })) {
      setCurrentUser(username);
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    logoutStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
