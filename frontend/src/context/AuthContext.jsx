import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

const TOKEN_KEY = "pkm_token";
const USER_KEY = "pkm_user";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setCurrentUser(user);

      return user;
    } finally {
      setLoading(false);
    }
  }

  async function register({ name, email, password, phone = "", address = "" }) {
    setLoading(true);

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        phone,
        address,
      });

      const { user, token } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setCurrentUser(user);

      return user;
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return;

    try {
      const response = await api.get("/me");
      const user = response.data.user;

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setCurrentUser(null);
    }
  }

  async function logout() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setCurrentUser(null);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  const isAdmin = currentUser?.role === "admin";
  const isCustomer = currentUser?.role === "customer";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isCustomer,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}