
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import api from "../Api/Axios-instance";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart, userId } = useContext(CartContext);

  // =======================If total is passed from cart page, use it — otherwise calculate here============================================
  const [total, setTotal] = useState(location.state?.total || 0);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ========================== Calculate Total Automatically ==========================
  useEffect(() => {
    if (cart && cart.length > 0) {
      const newTotal = cart.reduce((sum, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0
            : item.price || 0;
        const quantity = item.quantity || 1;
        return sum + price * quantity;
      }, 0);
      setTotal(newTotal);
    }
  }, [cart]);

  // ========================== Confirm Order ==========================
  const handleConfirmOrder = async () => {
    if (!name.trim() || !address.trim()) {
      alert("Please enter your name and address before confirming.");
      return;
    }

    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const newOrder = {
      id: "ORD" + Math.floor(Math.random() * 100000),
      date: new Date().toISOString().split("T")[0],
      customerName: name,
      address,
      total: total.toFixed(2),
      status: "Confirmed",
      items: cart.map((item) => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: item.quantity || 1,
      })),
    };

    try {
      setIsSubmitting(true);

      // 1========= Get user data==============
      const res = await api.get(`/users/${userId}`);
      const user = res.data;

      // =======Add order to user's order history==================
      const updatedOrders = user.orders ? [...user.orders, newOrder] : [newOrder];

      // ======Update user data in db.json==========
      await api.patch(`/users/${userId}`, {
        orders: updatedOrders,
        cart: [],
      });

      // 4️⃣ Clear local cart (context)
      clearCart();

      // 5️⃣ Success animation and redirect
      setSuccess(true);
      setTimeout(() => navigate("/orderlist"), 2000);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to complete order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================== Success Page ==========================
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <CheckCircle className="text-green-500 mb-6" size={80} />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Successful!
        </h1>
        <p className="text-gray-600">Redirecting to Order History...</p>
      </div>
    );
  }

  // ========================== Checkout Form ==========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Checkout Details
        </h1>

        {/*  Total Amount Display */}
        <p className="text-gray-600 mb-6">
          Total Amount:{" "}
          <strong className="text-indigo-600">
            ₹{total.toFixed(2)}
          </strong>
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
        ></textarea>

        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting || cart.length === 0}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition ${
            isSubmitting || cart.length === 0
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
        >
          {isSubmitting ? "Processing..." : "Confirm Order"}
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="w-full mt-4 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        {cart.length === 0 && (
          <p className="mt-4 text-gray-500 font-medium">
            Your cart is empty. Add products before checkout.
          </p>
        )}
      </div>
    </div>
  );
}
