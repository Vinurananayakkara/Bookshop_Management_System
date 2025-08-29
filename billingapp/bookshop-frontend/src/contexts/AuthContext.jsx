import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          // Verify session is still valid
          const response = await authAPI.me();
          const userInfo = {
            id: response.data.id,
            username: response.data.username,
            fullName: response.data.fullName,
            email: response.data.email,
            phone: response.data.phone,
            role: response.data.role || 'USER'
          };
          localStorage.setItem('user', JSON.stringify(userInfo));
          setUser(userInfo);
        } catch (error) {
          // Session expired or invalid
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      
      // Backend returns UserDto directly, no token needed for session-based auth
      const userInfo = {
        id: response.data.id,
        username: response.data.username,
        fullName: response.data.fullName,
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role || 'USER'
      };
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.status === 500) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (username, email, password, fullName, phone) => {
    try {
      const response = await authAPI.register({ 
        username, 
        email, 
        password, 
        fullName, 
        phone 
      });
      
      // Backend auto-logs in and returns UserDto
      const userInfo = {
        id: response.data.id,
        username: response.data.username,
        fullName: response.data.fullName,
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role || 'USER'
      };
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      let errorMessage = 'Registration failed';
      
      if (error.response?.status === 400) {
        // Handle both string and object error responses
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = 'Username or email already exists';
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
