import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Contact <span className="text-indigo-600">Us</span>
        </h1>
        <p className="text-center text-gray-600 mb-12">
          We'd love to hear from you! Have questions about our furniture,
          orders, or services? Get in touch with us.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send a Message
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Get in Touch
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <FaPhoneAlt className="text-indigo-600 text-xl" />
                <span className="text-gray-700">9744395412</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <FaEnvelope className="text-indigo-600 text-xl" />
                <span className="text-gray-700">support@furnico.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <FaMapMarkerAlt className="text-indigo-600 text-xl" />
                <span className="text-gray-700">
                  123 Furni Street, Kochi, India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
