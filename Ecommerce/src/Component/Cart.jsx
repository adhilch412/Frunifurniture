
import React, { useContext } from "react";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, userId } =
    useContext(CartContext);
  const navigate = useNavigate();

  // =========== If user not logged in — show login message=================================
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag size={64} className="text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">Please Login</h2>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // ===========Subtotal calculation (price × quantity)===============================
  const subtotal = cart.reduce((acc, item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[₹$]/g, "")) // remove ₹ or $
        : parseFloat(item.price) || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  // ======================= Shipping charge=========================
  const shipping = subtotal > 500 ? 0 : 10;

  // =======================Total==========================
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🛍 Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600">
            {cart.length === 0
              ? "Your cart is empty"
              : `${cart.reduce((a, b) => a + b.quantity, 0)} items in your cart`}
          </p>
        </div>

        {/* ===============If cart empty =====================*/}
        {cart.length === 0 ? (
          <div className="text-center space-y-8">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBag size={80} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8">
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/*  Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Clear Cart</span>
                </button>
              </div>

              {cart.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={
                      item.img ||
                      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=200"
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-indigo-600 font-bold text-xl">
                      {item.price}
                    </p>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* 🧾 Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h3>

              {/* Subtotal & Shipping */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span
                    className={`font-semibold ${
                      shipping === 0 ? "text-green-600" : ""
                    }`}
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout", { state: { cart, total } })}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <CreditCard size={24} />
                <span>Proceed to Checkout</span>
              </button>

              <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
                <p>Secure checkout with SSL encryption</p>
                <p>Free returns within 30 days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
