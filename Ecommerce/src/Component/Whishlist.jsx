import React, { useContext } from "react";
import { AuthContext } from "../Context/Authcontext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../Context/Whishcontext";

export default function Wishlist() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const { wishlist, removeFromWishlist, loading } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("Wishlist Page - User:", user);
  console.log("Wishlist Page - Wishlist:", wishlist);
  console.log("Wishlist Page - Loading:", loading);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl"></span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Please Login</h2>
          <p className="text-gray-600">
            You need to be logged in to view your wishlist.
          </p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Your Wishlist ({wishlist.length}{" "}
          {wishlist.length === 1 ? "item" : "items"})
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center space-y-6">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <span className="text-6xl"></span>
            </div>
            <p className="text-center text-gray-500 text-lg">
              Your wishlist is empty. Start adding some favorites!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <img
                  src={item.img || "https://via.placeholder.com/200"}
                  alt={item.name}
                  className="w-48 h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  {item.name}
                </h2>
                <p className="text-indigo-600 font-bold text-xl mb-4">
                  {item.price}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    <FaTrash className="mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
