import { createContext, useContext, useEffect, useState } from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether the user already has a session.
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication...");

      try {
        const response = await api.get("/api/auth/me");

        setUser(response.data.user);
      } catch (error) {
        console.log("AUTH ERROR:", {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          message: error.message,
        });

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (username, email, password) => {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  };

  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    setUser(response.data.user);

    return response.data;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
