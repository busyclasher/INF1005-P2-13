import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  membershipTier: string;
  joinDate: string;
  avatarInitials: string;
  phone?: string;
  bookings: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<User>) => void;
}

const DEMO_USERS: Array<User & { password: string }> = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'member@kinetikhub.com',
    password: 'Member@1234',
    role: 'member',
    membershipTier: 'Premium',
    joinDate: '2024-06-15',
    avatarInitials: 'AJ',
    phone: '+44 7700 900123',
    bookings: ['b1', 'b2', 'b3'],
  },
  {
    id: 'u2',
    name: 'Sarah Mitchell',
    email: 'admin@kinetikhub.com',
    password: 'Admin@1234',
    role: 'admin',
    membershipTier: 'Staff',
    joinDate: '2023-01-10',
    avatarInitials: 'SM',
    phone: '+44 7700 900456',
    bookings: [],
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const { password: _pwd, ...userWithoutPwd } = found;
      setUser(userWithoutPwd);
      return { success: true };
    }
    return { success: false, error: 'Invalid email address or password. Please try again.' };
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
