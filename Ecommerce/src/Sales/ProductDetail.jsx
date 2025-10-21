import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/Whishcontext";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../Api/Axios-instance";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { cart, addToCart, userId, updateQuantity } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/productes/${id}`);
        const normalizedProduct = {
          id: res.data.id || res.data[" id"],
          name: res.data.name || res.data[" name"],
          price: "₹" + res.data.price || res.data[" price"] || "$0.00",
          img:
            res.data.img ||
            "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: res.data.description,
        };
        setProduct(normalizedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        Product not found
      </div>
    );
  }

  const isFavorite = wishlist.find((w) => w.id === product.id);

  // Use a single image array for now
  const productImages = [product.img];

  // Check if product is in cart
  const cartItem = cart.find((item) => item.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (product) addToCart(product);
  };

  const handleWishlistToggle = () => {
    if (product) toggleWishlist(product, userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              <button
                onClick={handleWishlistToggle}
                disabled={!userId}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isFavorite
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white text-red-500 hover:bg-red-50 border border-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <span>(127 reviews)</span>
              <span className="text-green-600 font-medium">In Stock</span>
            </div>

            <div className="text-4xl font-bold text-indigo-600">
              {product.price}
            </div>
            <p>Free shipping on orders over $500</p>

            <div>
              <h3 className="text-xl font-semibold">Description</h3>
              <p>{`Enhance your living space with this exquisitely crafted ${product.name}. Designed for both style and comfort, this piece combines premium materials with modern elegance to create a timeless addition to your home.`}</p>
            </div>

            {/* Quantity & Cart */}
            <div className="space-y-6">
              {cartItem && (
                <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-md border border-gray-100 max-w-xs">
                  <button
                    onClick={() =>
                      updateQuantity(product.id, Math.max(1, quantity - 1))
                    }
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 text-gray-700 font-semibold"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-gray-800 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 text-gray-700 font-semibold"
                  >
                    +
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {cart.some((item) => item.productId === product.id) ? (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Buy Now</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={!userId}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 text-gray-700">
                <Truck size={24} className="text-indigo-500" />
                <div>
                  <div className="font-semibold">Free Shipping</div>
                  <div className="text-sm text-gray-500">
                    On orders over $500
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Shield size={24} className="text-indigo-500" />
                <div>
                  <div className="font-semibold">2 Year Warranty</div>
                  <div className="text-sm text-gray-500">
                    Quality guaranteed
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <RotateCcw size={24} className="text-indigo-500" />
                <div>
                  <div className="font-semibold">Easy Returns</div>
                  <div className="text-sm text-gray-500">30-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
