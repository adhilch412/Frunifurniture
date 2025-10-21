
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Filter, Star } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/Whishcontext";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../Api/Axios-instance";

export default function Shop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { addToCart, userId } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  // ==================== Fetch products ===========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/productes");

        const normalizedProducts = res.data.map((product) => ({
          id: product.id || product[" id"],
          name: product.name || product[" name"],
          price: "₹" + product.price || product[" price"] || "₹0.00",
          img:
            product.img ||
            "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400",
          description: product.description || "",
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

  // ======================== Add to cart ===========================
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  // ======================== Wishlist toggle =======================
  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // ======================== Navigate to product page ==============
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  // ======================= Loading UI =============================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="xl" />
          <p className="text-lg text-gray-600 font-medium">
            Loading amazing furniture...
          </p>
        </div>
      </div>
    );
  }

  // ====================== Filter & Sort ===========================
  const validProducts = products.filter(
    (item) =>
      item &&
      item.id &&
      item.name &&
      item.price &&
      typeof item.price === "string"
  );

  const filteredProducts = validProducts.filter((item) => {
    const name = item.name.toLowerCase();

    const category = name.includes("chair")
      ? "chairs"
      : name.includes("table")
      ? "tables"
      : name.includes("sofa")
      ? "sofas"
      : name.includes("bed")
      ? "beds"
      : "other";

    const categoryMatch = filter === "all" ? true : category === filter;
    const searchMatch = search ? name.includes(search.toLowerCase()) : true;

    return categoryMatch && searchMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, "")) || 0;
    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, "")) || 0;

    if (sortOrder === "lowToHigh") return priceA - priceB;
    if (sortOrder === "highToLow") return priceB - priceA;
    return 0;
  });

  // ====================== Pagination =============================
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // ======================== Render ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <section className="py-20 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter & Search Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-6">
            {/* Filter Button */}
            <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
              <Filter className="text-indigo-600" size={24} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700 transition-all duration-300"
              >
                <option value="all">All Products</option>
                <option value="chairs">Chairs</option>
                <option value="tables">Tables</option>
                <option value="sofas">Sofas</option>
                <option value="beds">Beds</option>
              </select>
            </div>

            {/* Search Bar (centered, wider than buttons) */}
            <div className="mx-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 pl-4 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-gray-700 shadow-lg transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort Button */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700 transition-all duration-300"
            >
              <option value="none">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100">
              <div className="text-8xl mb-6">🛋️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No products available
              </h3>
              <p className="text-gray-600 text-lg">
                Check back soon for new arrivals!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map((item) => {
                const isFavorite = wishlist.find((w) => w.id === item.id);
                const numericPrice =
                  parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;

                return (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-3 border border-gray-100"
                    onClick={() => handleProductClick(item.id)}
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-3xl">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <button
                        onClick={(e) => handleWishlistToggle(e, item)}
                        className={`absolute top-4 right-4 p-3 rounded-xl transition-all duration-300 shadow-lg transform hover:scale-110 ${
                          isFavorite
                            ? "bg-gradient-to-br from-red-500 to-pink-500 text-white scale-110"
                            : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white"
                        }`}
                        title={
                          isFavorite
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          size={20}
                          fill={isFavorite ? "currentColor" : "none"}
                        />
                      </button>
                      {numericPrice > 500 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          Premium
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-gradient-to-b from-white to-gray-50 rounded-b-3xl">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {item.price}
                        </span>
                        <div className="flex items-center space-x-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            (4.8)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        disabled={!userId}
                        className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCart size={20} />
                        <span>Add to Cart</span>
                      </button>

                      {!userId && (
                        <p className="text-sm text-gray-500 text-center mt-3 font-medium">
                          Login to add items to cart
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "bg-white/80 text-gray-700 hover:bg-indigo-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
