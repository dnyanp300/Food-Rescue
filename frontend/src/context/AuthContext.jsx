import React, { createContext, useState, useContext, useEffect } from "react";
import { authApi } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
    } catch (e) {
      console.error("Failed to parse auth from localStorage", e);
      localStorage.removeItem("auth");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      const authData = { token: data.access_token, user: data.user };
      setAuth(authData);
      localStorage.setItem("auth", JSON.stringify(authData));
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
     try {
      const user = await authApi.register(userData);
      return user;
    } catch (error) {
      throw error;
    }
  };
  
  const googleLogin = async (idToken) => {
    try {
      const data = await authApi.googleLogin(idToken);
      const authData = { token: data.access_token, user: data.user };
      setAuth(authData);
      localStorage.setItem("auth", JSON.stringify(authData));
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  const value = {
    ...auth,
    isAuthenticated: !!auth,
    loading,
    login,
    logout,
    register,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};