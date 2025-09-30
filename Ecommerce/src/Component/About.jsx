// Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[90vh]"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Transform Your <span className="text-yellow-400">Living Space</span>
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Premium furniture crafted with love — combining comfort, durability,
            and modern elegance.
          </p>
          <Link
            to="/shop"
            className="px-8 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "Sofas",
              img: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              name: "Beds",
              img: "https://images.pexels.com/photos/6585584/pexels-photo-6585584.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              name: "Dining Tables",
              img: "https://images.pexels.com/photos/6660154/pexels-photo-6660154.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              name: "Chairs",
              img: "https://images.pexels.com/photos/7512046/pexels-photo-7512046.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
          ].map((cat, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xl font-semibold">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-indigo-600 text-white py-14 text-center">
        <h2 className="text-3xl font-bold mb-4">Upgrade Your Living Space</h2>
        <p className="mb-6">
          Shop our latest collection and bring comfort & style to your home.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Explore Shop
        </Link>
      </section>
    </div>
  );
}
