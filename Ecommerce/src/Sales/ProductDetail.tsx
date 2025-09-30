import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/Whishcontext";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../Api/Axios-instance";

// Define Product interface for TypeScript
interface Product {
  id: string;
  name: string;
  price: string;
  img: string;
  description?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, userId } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/productes/${id}`);
        // Normalize product data from db.json
        const normalizedProduct: Product = {
          id: res.data.id || res.data[" id"],
          name: res.data.name || res.data[" name"],
          price: res.data.price || res.data[" price"] || "$0.00",
          img: res.data.img || "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800",
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

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product, userId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="xl" />
          <p className="text-lg text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = wishlist.find((w: Product) => w.id === product.id);
  const productImages = [product.img, product.img, product.img]; // Duplicate for demo

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
            <span className="font-medium">Back to Shop</span>
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
            
            {/* Thumbnail Images */}
            <div className="flex space-x-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index ? 'border-indigo-500 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <button
                  onClick={handleWishlistToggle}
                  disabled={!userId}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isFavorite
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-white text-red-500 hover:bg-red-50 border border-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-600">(127 reviews)</span>
                <span className="text-green-600 font-medium">In Stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-4xl font-bold text-indigo-600">
                {product.price}
              </div>
              <p className="text-gray-600">
                Free shipping on orders over $500
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 
                "This beautifully crafted piece combines style and functionality to create the perfect addition to your home. Made with premium materials and attention to detail, it's designed to last for years while maintaining its elegant appearance."}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-100">
                <Truck className="text-indigo-600" size={24} />
                <div>
                  <div className="font-medium text-gray-800">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over $500</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-100">
                <Shield className="text-green-600" size={24} />
                <div>
                  <div className="font-medium text-gray-800">2 Year Warranty</div>
                  <div className="text-sm text-gray-600">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-100">
                <RotateCcw className="text-blue-600" size={24} />
                <div>
                  <div className="font-medium text-gray-800">30-Day Returns</div>
                  <div className="text-sm text-gray-600">Easy returns</div>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!userId || !product}
                className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                <ShoppingCart size={24} />
                <span>Add to Cart</span>
              </button>
              
              {!userId && (
                <p className="text-center text-gray-600">
                  <span className="font-medium">Please login</span> to add items to cart
                </p>
              )}
            </div>

            {/* Product Specifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">Premium Wood</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">120 × 80 × 75 cm</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">15 kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">Natural</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}