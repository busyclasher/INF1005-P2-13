import React, { createContext, useContext, useState, useEffect } from 'react';
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'member' | 'admin' | 'instructor';
  membershipTier?: string;
  joinDate?: string;
}

// In AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: { firstName: string; lastName: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string}>;
  getAuthHeaders: () => Record<string, string>;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://35.212.166.173/backend/api';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const getAuthHeaders = (): Record<string, string> => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string}> => {
    if (!user) {
      return { success: false, error: 'User not authenticated'};
    }

    try {
      const response = await fetch(`${API_BASE}/delete_account.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      const result = await response.json();

      if (result.success) {
      // Clear user data from state and localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { success: true };
    } 
      else {
        return { success: false, error: result.error || 'Failed to delete account' };
      }
    }

    catch (error) {
      console.error('Network error deleting account:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Update the updateProfile function in AuthContext.tsx
  const updateProfile = async (data: { firstName: string; lastName: string; phone?: string }): Promise<{success: boolean, error?: string}> => {
    if (!user) {
      return { success: false, error: 'User not defined'};
    };

    try {
      const response = await fetch(`${API_BASE}/update_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || ''
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update local user state
        const updatedUser = { 
          ...user, 
          firstName: data.firstName, 
          lastName: data.lastName, 
          phone: data.phone || '' 
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        console.error('Profile update failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Network error updating profile:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };


  const login = async (email: string, password: string): Promise<{ success: boolean, error?: string}> => {
    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        const userData: User = {
          id: data.user.user_id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
          phone: data.user.phone || '',
          membershipTier: data.user.membershipTier || 'Essential',
          joinDate: data.user.joinDate || new Date().toISOString()
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        const newToken: string | undefined = data.token;
        if (newToken) {
          setToken(newToken);
          localStorage.setItem('token', newToken);
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid Credentials'};
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
      updateProfile,
      deleteAccount,
      getAuthHeaders,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};