import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const getStoredUser = () => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", credentials);
      const { token: newToken, user: newUser } = data.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      toast.success(`Welcome back, ${newUser.name.split(" ")[0]}!`);
      const redirectMap = { admin: "/admin", user: "/dashboard", store_owner: "/owner" };
      navigate(redirectMap[newUser.role] || "/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    try {
      await api.post("/auth/signup", userData);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed.";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully.");
    navigate("/login");
  }, [navigate]);

  const updatePassword = useCallback(async (passwords) => {
    setLoading(true);
    try {
      await api.put("/auth/update-password", passwords);
      toast.success("Password updated successfully.");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isOwner = user?.role === "store_owner";

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      isAdmin, isUser, isOwner,
      login, signup, logout, updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
