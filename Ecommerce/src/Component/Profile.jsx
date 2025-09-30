import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/Authcontext";
import api from "../Api/Axios-instance";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setLoading(false);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    try {
      const updatedUser = { ...user, name, email };
      await api.patch(`/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-32 text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-indigo-400 text-8xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-2 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition transform hover:-translate-y-1 hover:shadow-lg"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

