import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication functions for demo purposes
  const signup = async (email: string, password: string, displayName?: string) => {
    // Mock signup - in a real app, this would call an API
    const mockUser: User = {
      uid: 'mock-' + Date.now(),
      email,
      displayName: displayName || null,
      photoURL: null,
    };
    setCurrentUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would call an API
    const mockUser: User = {
      uid: 'mock-' + Date.now(),
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    };
    setCurrentUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('mockUser');
  };

  const resetPassword = async (email: string) => {
    // Mock password reset
    console.log('Password reset email would be sent to:', email);
  };

  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        displayName: displayName !== undefined ? displayName : currentUser.displayName,
        photoURL: photoURL !== undefined ? photoURL : currentUser.photoURL,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    }
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    const mockUser: User = {
      uid: 'google-' + Date.now(),
      email: 'user@gmail.com',
      displayName: 'Google User',
      photoURL: null,
    };
    setCurrentUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  const loginWithFacebook = async () => {
    // Mock Facebook login
    const mockUser: User = {
      uid: 'facebook-' + Date.now(),
      email: 'user@facebook.com',
      displayName: 'Facebook User',
      photoURL: null,
    };
    setCurrentUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
  };

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loginWithGoogle,
    loginWithFacebook,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};