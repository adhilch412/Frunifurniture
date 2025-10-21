
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ShoppingCart, Download, Trash2, Search } from "lucide-react";
import api from "../Api/Axios-instance";
import { toast } from "react-toastify";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);

  // ===============Fetch orders from db.json===================================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: users } = await api.get("/users");
        const customerUsers = users.filter((u) => u.role?.toLowerCase() !== "admin");

        //==================== Flatten orders and attach customer info==============================
        const allOrders = customerUsers.flatMap((user) =>
          (user.orders || []).map((order) => ({
            ...order,
            customerName: user.name,
            customerEmail: user.email,
            userId: user.id,
          }))
        );

        setOrders(allOrders);
        setFilteredOrders(allOrders);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders!");
        setError("Unable to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  //============= Filter orders by search=========================================
  useEffect(() => {
    let filtered = orders;
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id?.toString().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  //========================= Pagination=================================
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (page) => setCurrentPage(page);

  //==================== Delete order===============================
  const handleDeleteOrder = async (orderId, userId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const { data: user } = await api.get(`/users/${userId}`);
      const updatedOrders = (user.orders || []).filter((o) => o.id !== orderId);
      await api.patch(`/users/${userId}`, { orders: updatedOrders });

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setFilteredOrders((prev) => prev.filter((order) => order.id !== orderId));

      toast.success("Order deleted successfully");
    } catch (err) {
      toast.error("Failed to delete order");
      console.error(err);
    }
  };

  //============================= Update order status==================================
  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      const { data: user } = await api.get(`/users/${userId}`);
      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await api.patch(`/users/${userId}`, { orders: updatedOrders });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  if (loading) return <Loader message="Loading orders..." />;
  if (error) return <Error message={error} />;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto">
          <StatsCard label="Total Orders" value={orders.length} icon={ShoppingCart} color="blue" />

          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <OrdersTable
            currentOrders={currentOrders}
            handleDeleteOrder={handleDeleteOrder}
            handleStatusChange={handleStatusChange}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              totalOrders={filteredOrders.length}
              indexOfFirstOrder={indexOfFirstOrder}
              indexOfLastOrder={indexOfLastOrder}
            />
          )}
        </main>
      </div>
    </div>
  );
}

//====================== === UI Components =========================

const Loader = ({ message }) => (
  <div className="flex h-screen items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  </div>
);

const Error = ({ message }) => (
  <div className="flex h-screen items-center justify-center bg-white">
    <div className="text-center">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <p className="text-red-600 mb-2 text-lg font-medium">Error</p>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300"
      >
        Try Again
      </button>
    </div>
  </div>
);

const Header = ({ sidebarOpen, setSidebarOpen }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <span className="text-xl">☰</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
      </div>
   
    </div>
  </header>
);

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
    <div className="relative flex-1 w-full lg:max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search by name, email or order ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>
);

const StatsCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: "border-blue-500 bg-blue-50 text-blue-500",
  };
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

// === ================Orders Table ===========================
const OrdersTable = ({ currentOrders, handleDeleteOrder, handleStatusChange }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-xl font-bold text-gray-800">Orders</h3>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentOrders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-3 font-medium text-gray-800">#{order.id}</td>
              <td className="px-6 py-3">
                <p className="font-semibold text-gray-700">{order.customerName}</p>
                <p className="text-sm text-gray-500">{order.customerEmail}</p>
              </td>
              <td className="px-6 py-3">
                <select
                  value={order.status || "Pending"}
                  onChange={(e) => handleStatusChange(order.userId, order.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-3 flex space-x-2">
                <button
                  onClick={() => handleDeleteOrder(order.id, order.userId)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, paginate }) => (
  <div className="px-6 py-4 flex justify-center items-center space-x-2">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded-lg disabled:opacity-50"
    >
      Prev
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => paginate(page)}
        className={`px-4 py-2 rounded-lg ${
          currentPage === page ? "bg-blue-500 text-white" : "border hover:bg-gray-50"
        }`}
      >
        {page}
      </button>
    ))}
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded-lg disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default AllOrders;
