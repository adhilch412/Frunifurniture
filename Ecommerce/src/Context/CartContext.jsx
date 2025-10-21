
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../Api/Axios-instance";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const userId = user?.id || null;

  const [cart, setCart] = useState([]);

  // ================= Fetch user cart when user changes or on refresh =================
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setCart([]);
        return;
      }

      try {
        const res = await api.get(`/users/${userId}`);
        const userData = res.data;
        setCart(userData.cart || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load cart data");
      }
    };

    fetchUserData();
  }, [userId]);

  // ================= Helper: update user in db.json =================
  const updateUser = async (newData) => {
    if (!userId) return;
    try {
      const res = await api.get(`/users/${userId}`);
      const userData = res.data;
      await api.put(`/users/${userId}`, { ...userData, ...newData });
    } catch (err) {
      console.error("Error updating db.json:", err);
      toast.error("Failed to sync with database");
    }
  };

  // ================= Add to cart =================
  const addToCart = async (product) => {
    if (!userId) {
      toast.error("Please login to add products!");
      return;
    }

    try {
      const existingItem = cart.find((item) => item.productId === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast.success(`Increased quantity of ${product.name}!`);
      } else {
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          quantity: 1,
        };
        updatedCart = [...cart, newItem];
        toast.success(`${product.name} added to cart!`);
      }

      setCart(updatedCart);
      await updateUser({ cart: updatedCart });
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item");
    }
  };

  // ================= Update quantity =================
  const updateQuantity = async (productId, newQuantity) => {
    if (!userId || newQuantity < 1) return;
    try {
      const updatedCart = cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCart(updatedCart);
      await updateUser({ cart: updatedCart });
      toast.success("Quantity updated!");
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  // ================= Remove item =================
  const removeFromCart = async (productId) => {
    if (!userId) return;
    try {
      const updatedCart = cart.filter((item) => item.productId !== productId);
      setCart(updatedCart);
      await updateUser({ cart: updatedCart });
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  // ================= Clear cart =================
  const clearCart = async () => {
    if (!userId) return;
    try {
      setCart([]);
      await updateUser({ cart: [] });
      toast.success("Cart cleared successfully!");
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart,
    userId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

