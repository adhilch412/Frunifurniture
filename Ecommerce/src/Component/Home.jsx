
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 font-sans overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[90vh] bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 flex flex-col justify-center items-center text-center text-white px-6">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Make Your Home <span className="text-amber-400 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Stylish</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl text-gray-200 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Discover premium furniture that blends comfort and modern design to
            fit your lifestyle.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link
              to="/shop"
              className="px-10 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-xl shadow-2xl hover:shadow-amber-200/50 hover:scale-105 transition-all duration-300 text-lg"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <motion.h2 
          className="text-4xl font-bold text-center text-gray-800 mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Shop by <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Category</span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
              className="relative group rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
              whileHover={{ scale: 1.05, y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-white text-xl font-bold tracking-wide">
                  {cat.name}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
    
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-6 text-center bg-gradient-to-br from-white to-gray-50 rounded-3xl my-10 shadow-xl">
        <motion.h2 
          className="text-4xl font-bold text-gray-800 mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          What Our <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Customers</span> Say
        </motion.h2>
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
              className="bg-white shadow-xl rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-amber-400 text-4xl mb-4">"</div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">"{review.text}"</p>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mb-4"></div>
              <h4 className="font-bold text-gray-800 text-xl">{review.name}</h4>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section>
      
      
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-10 left-10 w-8 h-8 bg-amber-400 rounded-full opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-6 h-6 bg-white rounded-full opacity-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </section>
    </div>
  );
}