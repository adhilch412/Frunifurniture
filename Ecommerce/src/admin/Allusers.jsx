import React, { useState, useEffect } from "react";
import api from "../Api/Axios-instance";
import Sidebar from "./Sidebar";
import {
  Users,
  UserCheck,
  UserX,
  Trash2,
  Search,
  Ban,
  CheckCircle,
} from "lucide-react";

function Allusers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        const data = res.data.map((u) => ({
          ...u,
          status: u.isBlock ? "Blocked" : "Active",
        }));
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ===================Filter users by search=========================
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  //=================== Toggle block/unblock==============================
  const toggleUserBlock = async (id) => {
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, isBlock: !u.isBlock } : u
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);

    try {
      const userToUpdate = updatedUsers.find((u) => u.id === id);
      await api.put(`/users/${id}`, userToUpdate);
    } catch (err) {
      console.error("Failed to update user block status:", err);
      alert("Could not update user status. Try again.");
    }
  };

  // ========================Delete user===================================
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      const updatedUsers = users.filter((u) => u.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const indexOfLast = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfLast - usersPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading)
    return (
      <div className="flex h-screen bg-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                ☰
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Users Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your users and roles
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard icon={Users} label="Total Users" color="blue" count={users.length} />
            <StatsCard
              icon={UserCheck}
              label="Active Users"
              color="green"
              count={users.filter((u) => !u.isBlock).length}
            />
            <StatsCard
              icon={UserX}
              label="Blocked Users"
              color="red"
              count={users.filter((u) => u.isBlock).length}
            />
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200 flex items-center">
            <Search className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["User", "Role", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold">
                          {user.name?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.isBlock
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isBlock ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <IconBtn
                          Icon={user.isBlock ? CheckCircle : Ban}
                          color={user.isBlock ? "green" : "red"}
                          onClick={() => toggleUserBlock(user.id)}
                        />
                        <IconBtn
                          Icon={Trash2}
                          color="red"
                          onClick={() => handleDeleteUser(user.id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === p
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Stats Card
const StatsCard = ({ icon: Icon, label, color, count }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
      </div>
      <div className={`p-3 rounded-lg bg-${color}-50`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
    </div>
  </div>
);

//================ Icon Button==================
const IconBtn = ({ Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg text-${color}-600 hover:bg-${color}-50 transition`}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export default Allusers;
