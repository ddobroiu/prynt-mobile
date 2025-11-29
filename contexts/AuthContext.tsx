import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const TOKEN_KEY = 'prynt_token';
const USER_KEY = 'prynt_user';

// API base URL
const API_BASE = __DEV__ ? 'http://localhost:3000/api' : 'https://www.prynt.ro/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = () => setError(null);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY)
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error loading stored auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthData = async (authToken: string, userData: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, authToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userData))
      ]);
      setToken(authToken);
      setUser(userData);
    } catch (err) {
      console.error('Error saving auth data:', err);
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY)
      ]);
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Error clearing auth data:', err);
    }
  };

  // Login function - uses credentials-based auth compatible with NextAuth
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, try to authenticate with credentials
      const response = await fetch(`${API_BASE}/auth/signin/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          password,
          redirect: 'false',
          callbackUrl: '/account'
        })
      });

      if (response.ok) {
        // For mobile, we'll need a JWT token instead of session cookies
        // Let's create a mobile-specific login endpoint
        const mobileResponse = await fetch(`${API_BASE}/auth/mobile-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        if (mobileResponse.ok) {
          const { token: authToken, user: userData } = await mobileResponse.json();
          await saveAuthData(authToken, userData);
          return true;
        }
      }
      
      setError('Email sau parolă incorectă');
      return false;
    } catch (err) {
      setError('Eroare de conexiune');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - uses existing register API
  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      
      if (data.success) {
        // After successful registration, automatically login
        return await login(email, password);
      } else {
        setError(data.message || 'Eroare la înregistrare');
        return false;
      }
    } catch (err) {
      setError('Eroare de conexiune');
      console.error('Register error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await clearAuthData();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;