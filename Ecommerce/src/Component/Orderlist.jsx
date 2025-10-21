
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import api from "../Api/Axios-instance";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function OrderList() {
  const { userId } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        navigate("/login"); // redirect to login if not logged in
        return;
      }

      try {
        const res = await api.get(`/users/${userId}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-lg text-gray-600 font-medium">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-xl text-gray-700 font-medium mb-4">No orders found!</p>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-10">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-gray-800">
                    Order ID: {order.id}
                  </span>
                  <span className="text-gray-600">{order.date}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col bg-gray-50 rounded-xl p-4 shadow-sm"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <div className="flex justify-between mt-2 items-center">
                        <span className="text-indigo-600 font-bold">{item.price}</span>
                        <span className="text-gray-600">Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-gray-700 font-medium">
                    Total: ${()=>order.total.toFixed(2)}
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full font-semibold text-sm ${
                      order.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
