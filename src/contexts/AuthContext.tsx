'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: User) => u.email === email)) {
        throw new Error('Email sudah terdaftar');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        password, // In production, this should be hashed
        name
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      toast.success('Registrasi Berhasil', {
        description: 'Akun Anda telah dibuat'
      });
    } catch (error) {
      toast.error('Registrasi Gagal', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Email atau password salah');
      }

      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);

      toast.success('Login Berhasil', {
        description: `Selamat datang, ${foundUser.name}!`
      });
    } catch (error) {
      toast.error('Login Gagal', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logout Berhasil', {
      description: 'Sampai jumpa lagi!'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
