// ================Home.jsx===============
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[90vh]"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/88/e9/29/88e929dfc2e1333910237cac7fcb4dc7.jpg')",
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

    

      {/* Call To Action */}
      <section>
     
      
      </section>
    </div>
  );
}
