
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./Authcontext";
import api from "../Api/Axios-instance";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===================Fetch wishlist whenever user changes===============================
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/users/${user.id}`);
        const userData = res.data;
        setWishlist(userData.wishlist || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // ===============================Toggle wishlist item======================================
  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error("Please login to manage wishlist!");
      return;
    }

    const exists = wishlist.find((item) => item.id === product.id);
    const updatedWishlist = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    // Update UI instantly
    setWishlist(updatedWishlist);
console.log(user.id)
    try {
      await api.patch(`/users/${user.id}`, {
        wishlist: updatedWishlist,
      });

      toast.success(
        exists
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`
      );
    } catch (err) {
      console.error("Error updating wishlist in DB:", err);
      toast.error("Failed to update wishlist");
      // Revert on error
      setWishlist(wishlist);
    }
  };

  // =================Remove item directly==============================
  const removeFromWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to manage wishlist!");
      return;
    }

    const productToRemove = wishlist.find((item) => item.id === productId);
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);

    setWishlist(updatedWishlist);

    try {
      await api.patch(`/users/${user.id}`, {
        wishlist: updatedWishlist,
      });
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.error("Error removing from DB:", err);
      toast.error("Failed to remove from wishlist");
      // Revert on error
      if (productToRemove) {
        setWishlist((prev) => [...prev, productToRemove]);
      }
    }
  };

  const value = {
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    loading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
