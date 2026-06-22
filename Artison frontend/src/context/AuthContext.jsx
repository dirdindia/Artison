import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

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
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyUser = {
          id: "usr_123",
          name: email.split("@")[0],
          email,
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70",
          role: "collector",
        };
        setUser(dummyUser);
        toast.success("Welcome back!");
        resolve(dummyUser);
        
        // Redirect logic
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }, 800);
    });
  };

  const signup = async (name, email, password, role) => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: "usr_" + Math.random().toString(36).substr(2, 9),
          name,
          email,
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70",
          role,
        };
        setUser(newUser);
        toast.success("Account created successfully!");
        resolve(newUser);
        navigate("/");
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
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
