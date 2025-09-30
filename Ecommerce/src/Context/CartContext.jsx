




// CartContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../Api/Axios-instance";
import { showSuccess, showError } from "../utils/toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).id : null;
  });

  // Sync userId with localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserId(JSON.parse(user).id);
    } else {
      setUserId(null);
      setCart([]);
      setWishlist([]);
    }
  }, []);

  // Fetch user data (cart & wishlist)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/users/${userId}`);
        const user = res.data;

        setCart(user.cart || []);
        setWishlist(user.wishlist || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
  }, [userId]);

  // Helper: update user in db.json
  const updateUser = async (newData) => {
    try {
      const res = await api.get(`/users/${userId}`);
      const user = res.data;
      await api.put(`/users/${userId}`, { ...user, ...newData });
    } catch (err) {
      console.error("Error updating db.json:", err);
      showError("Failed to sync with database");
    }
  };

  // Add to cart
  const addToCart = async (product) => {
    if (!userId) {
      showError("Please login to add products!");
      return;
    }

    try {
      const existingItem = cart.find(item => item.productId === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        showSuccess(`Increased quantity of ${product.name}!`);
      } else {
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1,
        };
        updatedCart = [...cart, newItem];
        showSuccess(`${product.name} added to cart!`);
      }

      setCart(updatedCart);
      await updateUser({ cart: updatedCart });
    } catch (err) {
      console.error("Error adding to cart:", err);
      showError("Failed to add item");
    }
  };

  // Update quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (!userId || newQuantity < 1) return;
    try {
      const updatedCart = cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCart(updatedCart);
      await updateUser({ cart: updatedCart });
    } catch (err) {
      console.error("Error updating quantity:", err);
      showError("Failed to update quantity");
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    if (!userId) return;
    try {
      const updatedCart = cart.filter(item => item.productId !== productId);
      setCart(updatedCart);
      await updateUser({ cart: updatedCart });
      showSuccess("Item removed");
    } catch (err) {
      console.error("Error removing item:", err);
      showError("Failed to remove item");
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!userId) return;
    try {
      setCart([]);
      await updateUser({ cart: [] });
      showSuccess("Cart cleared");
    } catch (err) {
      console.error("Error clearing cart:", err);
      showError("Failed to clear cart");
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        userId,
        setUserId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
