// Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // animation library (works well with Tailwind)

export default function Home() {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[85vh]"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-6">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Make Your Home <span className="text-yellow-400">Stylish</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-6 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Discover premium furniture that blends comfort and modern design to
            fit your lifestyle.
          </motion.p>
          <Link
            to="/shop"
            className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              name: "Sofas",
              img: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600",
            },
            {
              name: "Beds",
              img: "https://images.pexels.com/photos/6585670/pexels-photo-6585670.jpeg?auto=compress&cs=tinysrgb&w=600",
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
            <motion.div
              key={index}
              className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xl font-semibold">
                  {cat.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">
          What Our Customers Say
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Aditi Sharma",
              text: "Absolutely loved the sofa I bought! Great quality and service.",
            },
            {
              name: "Rahul Verma",
              text: "The dining table looks perfect in my home. Highly recommend!",
            },
            {
              name: "Sneha Kapoor",
              text: "Amazing designs and super comfortable furniture.",
            },
          ].map((review, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-600 italic mb-4">"{review.text}"</p>
              <h4 className="font-semibold text-gray-800">{review.name}</h4>
            </motion.div>
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
          className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Explore Shop
        </Link>
      </section>
    </div>
  );
}
