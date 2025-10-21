
import React, { createContext, useState, useEffect } from "react";
import api from "../Api/Axios-instance";
import { toast } from "react-toastify"; 

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ================= SIGNUP =================
  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await api.get(`/users?email=${email}`);
      if (res.data.length > 0) {
        toast.error("Email already exists!");    
        return false;
      }

      const newUser = {
        name,
        email,
        password,
        cart: [],
        wishlist: [],
        orders: [],
        role: "user",
        isBlock: false,
      };

      const response = await api.post("/users", newUser);
      setUser(response.data);
      toast.success("Account created successfully!");  
      return response.data;
    } catch (err) {
      console.error(err);
      toast.error("Signup failed! Please try again."); 
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.get(`/users?email=${email}&password=${password}`);
      const foundUsers = res.data;

      if (foundUsers.length === 0) {
        toast.error("Invalid email or password!");  
        return null;
      }

      const found = foundUsers[0];

      if (found.isBlock) {
        toast.warning("Your account has been blocked by admin. Please contact support."); 
        return null;
      }

      setUser(found);
      toast.success(`Welcome back, ${found.name}!`); 
      return found;
    } catch (err) {
      console.error(err);
      toast.error("Login failed! Please try again."); 
      return null;
    } finally {
      setLoading(false);
    }
  };



  const logout = () => {
  setUser(null);
  localStorage.removeItem("user");

};
  const value = { user, setUser, login, signup, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
