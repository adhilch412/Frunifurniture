import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Filter } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/Whishcontext";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../Api/Axios-instance";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { addToCart, userId } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/productes"); // Use correct endpoint
        console.log("API Response:", res.data); // Log for debugging
        // Normalize product data
        const normalizedProducts = res.data.map(product => ({
          id: product.id || product[" id"], // Handle duplicate id fields
          name: product.name || product[" name"],
          price: product.price || product[" price"] || "$0.00", // Handle price vs " price"
          img: product.img || "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400",
        }));
        setProducts(normalizedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="xl" />
          <p className="text-lg text-gray-600 font-medium">Loading amazing furniture...</p>
        </div>
      </div>
    );
  }

  // Filter valid products
  const validProducts = products.filter(
    (item) => item && item.id && item.name && item.price && typeof item.price === 'string'
  );

  // Apply category filter
  const filteredProducts = filter === "all"
    ? validProducts
    : validProducts.filter(item => {
        const category = item.name.toLowerCase().includes("chair") ? "chairs" :
                        item.name.toLowerCase().includes("table") ? "tables" :
                        item.name.toLowerCase().includes("sofa") ? "sofas" :
                        item.name.toLowerCase().includes("bed") ? "beds" : "other";
        return category === filter;
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Discover Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Furniture
            </span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Transform your space with our curated collection of premium furniture pieces
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <Filter className="text-gray-500" size={20} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Products</option>
                <option value="chairs">Chairs</option>
                <option value="tables">Tables</option>
                <option value="sofas">Sofas</option>
                <option value="beds">Beds</option>
              </select>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">{filteredProducts.length}</span> products found
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛋️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products available</h3>
              <p className="text-gray-600">Check back soon for new arrivals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((item) => {
                const isFavorite = wishlist.find((w) => w.id === item.id);
                const numericPrice = item.price && typeof item.price === 'string'
                  ? parseFloat(item.price.replace('$', '')) || 0
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                    onClick={() => handleProductClick(item.id)}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-100 rounded-t-2xl">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(item.id);
                          }}
                          className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                          title="Quick View"
                        >
                          <Eye size={20} className="text-gray-800" />
                        </button>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, item)}
                        className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 shadow-lg ${
                          isFavorite
                            ? "bg-red-500 text-white scale-110"
                            : "bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white"
                        }`}
                        title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart 
                          size={18} 
                          fill={isFavorite ? "currentColor" : "none"} 
                        />
                      </button>

                      {/* Sale Badge */}
                      {numericPrice > 500 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Premium
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-indigo-600">
                          {item.price}
                        </span>
                        <div className="flex items-center text-yellow-400">
                          {"★".repeat(5)}
                          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                        </div>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        disabled={!userId}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </button>
                      
                      {!userId && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Login to add items
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}