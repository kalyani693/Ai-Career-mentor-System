import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, loginAdmin } from '../api/auth';
import { getUserProfile } from '../api/profile';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('user_role') || 'user'); // 'user' | 'admin'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    if (role === 'admin') {
      setUser({ Username: 'Admin', role: 'admin' });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getUserProfile();
      if (res && res.response) {
        setUser(res.response);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Token might be invalid or expired
      if (err.response?.status === 401) {
        setToken(null);
        setRole('user');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
      }
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUserLogin = async (username, password) => {
    setAuthError(null);
    try {
      const data = await loginUser(username, password);
      const accessToken = data.access_token;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user_role', 'user');
      setToken(accessToken);
      setRole('user');

      // Fetch profile details immediately
      const profileRes = await getUserProfile();
      if (profileRes && profileRes.response) {
        setUser(profileRes.response);
      }
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Login failed';
      setAuthError(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      return { success: false, error: detail };
    }
  };

  const handleAdminLogin = async (username, password) => {
    setAuthError(null);
    try {
      const data = await loginAdmin(username, password);
      const accessToken = data.access_token;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user_role', 'admin');
      setToken(accessToken);
      setRole('admin');
      setUser({ Username: username, role: 'admin' });
      return { success: true };
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Admin login failed';
      setAuthError(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      return { success: false, error: detail };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setToken(null);
    setRole('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        loading,
        authError,
        login: handleUserLogin,
        adminLogin: handleAdminLogin,
        logout,
        refreshProfile: fetchProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
