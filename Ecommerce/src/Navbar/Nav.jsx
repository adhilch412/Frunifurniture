
import React, { useContext, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X, Sparkles } from "lucide-react";
import { AuthContext } from "../Context/Authcontext";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/Whishcontext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path, requiresAuth = false) => {
    if (requiresAuth && !user) {
      navigate('/login');
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
                            <div className="h-14 w-14 overflow-hidden rounded-2xl shadow-sm">
                <img 
                  src="https://i.pinimg.com/736x/52/64/86/5264867db55ace43cab63950fd98378f.jpg" 
                  alt="Nestify Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NESTIFY
              </span>
              <span className="text-xs text-gray-500 font-medium">Premium Furniture</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-2xl ${
                  location.pathname === link.path
                    ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25"
                    : "text-gray-700 hover:text-purple-600 hover:bg-gray-50/80"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-md opacity-50"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* User Profile */}
            <button
              onClick={() => handleNavigation("/profile", true)}
              className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              title="Profile"
            >
              <User size={22} />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavigation("/wishlist", true)}
              className="relative p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              title="Wishlist"
            >
              <Heart 
                size={22} 
                className={wishlist?.length > 0 ? "text-red-500 fill-red-500" : ""}
              />
              {user && wishlist?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => handleNavigation("/cart", true)}
              className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              title="Cart"
            >
              <ShoppingBag size={22} />
              {user && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4 ml-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">Hi, {user.name}!</p>
                  <p className="text-xs text-gray-500">Welcome back</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 py-6 space-y-4 bg-white/95 backdrop-blur-xl rounded-3xl mt-2 shadow-2xl">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.path)}
                className={`block w-full text-left px-6 py-4 text-base font-semibold transition-all duration-300 rounded-2xl mx-4 ${
                  location.pathname === link.path
                    ? "text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
                    : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </button>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200/50 pt-6 space-y-4 px-4">
              {user ? (
                <>
                  <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
                    <p className="text-sm font-bold text-gray-900">Hi, {user.name}!</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation("/profile", true)}
                    className="flex items-center w-full px-4 py-4 text-base font-semibold text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all duration-300"
                  >
                    <User size={20} className="mr-4" />
                    My Profile
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/wishlist", true)}
                    className="flex items-center w-full px-4 py-4 text-base font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300"
                  >
                    <Heart size={20} className="mr-4" />
                    Wishlist
                    {wishlist?.length > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleNavigation("/cart", true)}
                    className="flex items-center w-full px-4 py-4 text-base font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-300"
                  >
                    <ShoppingBag size={20} className="mr-4" />
                    Shopping Cart
                    {cartItemsCount > 0 && (
                      <span className="ml-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-4 text-base font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3 px-4">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-center shadow-lg hover:shadow-purple-500/25"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation("/sign")}
                    className="w-full px-4 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-2xl hover:bg-purple-50 transition-all duration-300 text-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;