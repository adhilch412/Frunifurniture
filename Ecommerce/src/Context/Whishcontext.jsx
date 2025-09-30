import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./Authcontext.jsx";
import { showSuccess, showError } from "../utils/toast";

const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/users/${user.id}`);
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      showError("Please login to manage wishlist!");
      return;
    }

    const exists = wishlist.find((item) => item.id === product.id);
    const updatedWishlist = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updatedWishlist);

    try {
      await axios.patch(`http://localhost:5005/users/${user.id}`, {
        wishlist: updatedWishlist,
      });
      
      showSuccess(
        exists
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`
      );
    } catch (err) {
      console.error("Error updating wishlist in DB:", err);
      showError("Failed to update wishlist");
      // Revert on error
      setWishlist(exists ? [...wishlist, product] : wishlist.filter((item) => item.id !== product.id));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    const productToRemove = wishlist.find(item => item.id === productId);
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);

    try {
      await axios.patch(`http://localhost:5005/users/${user.id}`, {
        wishlist: updatedWishlist,
      });
      showSuccess("Item removed from wishlist");
    } catch (err) {
      console.error("Error removing from DB:", err);
      showError("Failed to remove from wishlist");
      // Revert on error
      if (productToRemove) {
        setWishlist(prev => [...prev, productToRemove]);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export { WishlistContext };