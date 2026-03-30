<<<<<<< HEAD
import { createContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const requestOtp = async (email, password, role) => {
    try {
      const { data } = await axios.post(`${API_BASE}/request-otp`, {
        email,
        password,
        role,
      });

      return {
        success: true,
        message: data.message,
        email: data.email,
        role: data.role,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "OTP request failed",
      };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await axios.post(`${API_BASE}/verify-otp`, {
        email,
        otp,
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      return { success: true, user: data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "OTP verification failed",
      };
    }
  };

  const register = async (name, email, password, role, extras = {}) => {
    try {
      const { data } = await axios.post(`${API_BASE}/register`, {
=======
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Solve: Initialize state directly from localStorage
  // This prevents the "setUser" error because we don't need to call it inside useEffect
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 1. Check if user is already logged in (Logic moved to useState above)
  useEffect(() => {
    // This effect is now empty or can be used for verifying the token with the server
  }, []);

  // 2. Login Function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data)); 
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // 3. Register Function
  const register = async (name, email, password, role) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        name,
        email,
        password,
        role,
<<<<<<< HEAD
        ...extras,
      });

      return {
        success: true,
        message: data.message,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
=======
      });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // 4. Logout Function
  const logout = () => {
    localStorage.removeItem('userInfo');
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    setUser(null);
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider
      value={{
        user,
        requestOtp,
        verifyOtp,
        register,
        logout,
      }}
    >
=======
    <AuthContext.Provider value={{ user, login, register, logout }}>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;