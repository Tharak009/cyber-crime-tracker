import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    setToken(data.data.token);
    setUser({
      id: data.data.userId,
      fullName: data.data.fullName,
      email: data.data.email,
      role: data.data.role
    });
    return data.data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/me");
    setUser((prev) => ({
      ...prev,
      ...data.data
    }));
    return data.data;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      register,
      refreshProfile,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
