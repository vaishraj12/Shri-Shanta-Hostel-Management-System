// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// User interface
export interface User {
  email: string;
  name: string;
  role: 'student' | 'warden' | 'maintenance_department'| 'admin';
  //hostelname: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hostelUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('hostelUser');
    setUser(null);
  };

  const isAuthenticated = !!user; // True if user exists

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
