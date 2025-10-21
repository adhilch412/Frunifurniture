
import React, { useState, useEffect } from "react";
import api from "../Api/Axios-instance";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // =================Fetch data from db.json==================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersResponse = await api.get("/users");
        const usersData = usersResponse.data;

        const productsResponse = await api.get("/productes");
        const productsData = productsResponse.data;

        const totalUsers = usersData.length;
        const totalProducts = productsData.length;

        let totalOrders = 0;
        let totalRevenue = 0;
        const monthlySales = {};

        usersData.forEach((user) => {
          if (user.orders) {
            totalOrders += user.orders.length;
            user.orders.forEach((order) => {
              const orderTotal = parseFloat(order.total) || 0;
              totalRevenue += orderTotal;
              
              // =========Extract month from order date for sales data===========================
              const orderDate = new Date(order.date);
              const monthYear = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
              const monthName = orderDate.toLocaleString('default', { month: 'short' });
              
              if (!monthlySales[monthYear]) {
                monthlySales[monthYear] = {
                  month: monthName,
                  sales: 0,
                  orders: 0
                };
              }
              monthlySales[monthYear].sales += orderTotal;
              monthlySales[monthYear].orders += 1;
            });
          }
        });

        // =================Convert monthly sales to array and get last 6 months=====================
        const salesArray = Object.entries(monthlySales)
          .map(([key, data]) => ({
            ...data,
            date: key
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-6);

        setSalesData(salesArray);

        const allOrders = usersData.reduce((acc, user) => {
          if (user.orders) {
            const userOrders = user.orders.map((order) => ({
              ...order,
              customer: user.name,
              customerEmail: user.email,
            }));
            return [...acc, ...userOrders];
          }
          return acc;
        }, []);

        const sortedOrders = allOrders
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setStats([
          {
            title: "Total Users",
            value: totalUsers.toString(),
            change: "+12%",
            icon: "👥",
            color: "blue",
          },
          {
            title: "Revenue",
            value: `₹${totalRevenue.toFixed(2)}`,
            change: "+8%",
            icon: "💰",
            color: "green",
          },
          {
            title: "Orders",
            value: totalOrders.toString(),
            change: "+5%",
            icon: "📦",
            color: "purple",
          },
          {
            title: "Products",
            value: totalProducts.toString(),
            change: "+3%",
            icon: "📈",
            color: "orange",
          },
        ]);

        const formattedOrders = sortedOrders.map((order) => ({
          id: order.id,
          customer: order.customer,
          date: new Date(order.date).toLocaleDateString(),
          amount: `₹${order.total}`,
          status: order.status || "Completed",
        }));

        setRecentOrders(formattedOrders);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate max sales for chart scaling
  const maxSales = salesData.length > 0 
    ? Math.max(...salesData.map(item => item.sales)) 
    : 0;

  const getBorderColorClass = (color) => {
    const colorMap = {
      blue: "border-blue-500",
      green: "border-green-500",
      purple: "border-purple-500",
      orange: "border-orange-500",
    };
    return colorMap[color] || "border-blue-500";
  };

  const getBgColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-50",
      green: "bg-green-50",
      purple: "bg-purple-50",
      orange: "bg-orange-50",
    };
    return colorMap[color] || "bg-blue-50";
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="text-xl">☰</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome back, Admin!</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${getBorderColorClass(
                  stat.color
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stat.value}
                    </p>
                    <span className="text-green-500 text-sm font-medium flex items-center mt-1">
                      <span className="mr-1">↑</span>
                      {stat.change} from last month
                    </span>
                  </div>
                  <div
                    className={`text-2xl p-3 rounded-lg ${getBgColorClass(
                      stat.color
                    )}`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders + Sales Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Orders
                </h2>
                <button
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  onClick={() => navigate("/admin/orders")}
                >
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
                      >
                        <td className="py-4 text-sm font-medium text-gray-800">
                          {order.id}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {order.customer}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {order.date}
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-800">
                          {order.amount}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Sales Overview
                </h2>
                <span className="text-sm text-gray-500">
                  Last 6 Months
                </span>
              </div>
              
              {salesData.length > 0 ? (
                <div className="space-y-4">
                  {/* Chart Bars */}
                  <div className="flex items-end justify-between h-48 px-4 pb-4 border-b">
                    {salesData.map((monthData, index) => {
                      const height = maxSales > 0 
                        ? (monthData.sales / maxSales) * 80 
                        : 0;
                      
                      return (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div className="text-xs text-gray-500 font-medium">
                            ₹{monthData.sales.toFixed(0)}
                          </div>
                          <div
                            className="w-8 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 ease-out hover:from-blue-400 hover:to-blue-500"
                            style={{ height: `${height}%` }}
                            title={`₹${monthData.sales.toFixed(2)}`}
                          />
                          <div className="text-xs text-gray-600 font-medium">
                            {monthData.month}
                          </div>
                          <div className="text-xs text-gray-400">
                            {monthData.orders} orders
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        ₹{salesData.reduce((sum, month) => sum + month.sales, 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Total Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {salesData.reduce((sum, month) => sum + month.orders, 0)}
                      </p>
                      <p className="text-xs text-gray-500">Total Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {salesData.length > 0 
                          ? `₹${(salesData.reduce((sum, month) => sum + month.sales, 0) / salesData.reduce((sum, month) => sum + month.orders, 1)).toFixed(2)}`
                          : '₹0.00'
                        }
                      </p>
                      <p className="text-xs text-gray-500">Avg. Order Value</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-600">No sales data available</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Sales chart will appear here when orders are placed
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
