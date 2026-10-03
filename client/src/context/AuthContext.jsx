import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('carbazaar_user');
    const token = localStorage.getItem('carbazaar_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('carbazaar_user', JSON.stringify(userData));
      localStorage.setItem('carbazaar_token', userData.token);
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('carbazaar_user', JSON.stringify(userData));
      localStorage.setItem('carbazaar_token', userData.token);
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carbazaar_user');
    localStorage.removeItem('carbazaar_token');
  };

  // Demo 1-click accounts for rapid end-to-end testing
  const loginAs = async (role) => {
    let email = 'seller@carbazaar.com';
    if (role === 'admin') email = 'admin@carbazaar.com';
    if (role === 'buyer') email = 'buyer@carbazaar.com';
    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginAs,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSeller: user?.role === 'customer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
