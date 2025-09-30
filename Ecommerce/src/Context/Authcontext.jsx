import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../utils/toast";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5005/users?email=${email}`);
      if (res.data.length > 0) {
        showError("Email already exists!");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        cart: [],
        wishlist: [],
      };

      await axios.post("http://localhost:5005/users", newUser);
      showSuccess("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      showError("Signup failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5005/users?email=${email}&password=${password}`
      );

      if (res.data.length === 0) {
        showError("Invalid email or password!");
        return;
      }

      setUser(res.data[0]);
      showSuccess(`Welcome back, ${res.data[0].name}!`);
      navigate("/");
    } catch (err) {
      console.error(err);
      showError("Login failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    showSuccess("Logged out successfully!");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}