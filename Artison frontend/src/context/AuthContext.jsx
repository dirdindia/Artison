import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("artisana-user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      localStorage.setItem("artisana-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("artisana-user");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login-user', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast.success(data.message || "Welcome back!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
        return data.data.user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      throw error;
    }
  };

  const signup = async (name, email, password, phone, role) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password, phone, role });
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        toast.success(data.message || "Account created successfully!");
        navigate("/");
        return data.data.user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed";
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
