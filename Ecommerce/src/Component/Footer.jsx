import React from "react";
import {
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">FC</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  NESTIFY
                </span>
                <p className="text-xs text-gray-400">Premium Furniture</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Creating beautiful spaces with quality furniture that combines
              style, comfort, and functionality for modern living.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <Icon size={18} className="text-gray-300 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Explore</h3>
            <ul className="space-y-3">
              {[
                "Home",
                "Shop",
                "Collections",
                "New Arrivals",
                "Best Sellers",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 hover:font-medium flex items-center"
                  >
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 hover:opacity-100 transition-opacity"></div>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-3">
              {[
                "Contact Us",
                "Shipping Info",
                "Returns",
                "FAQ",
                "Size Guide",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-purple-300 transition-all duration-300 hover:translate-x-1 hover:font-medium flex items-center"
                  >
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-3 opacity-0 hover:opacity-100 transition-opacity"></div>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 group">
                <MapPin
                  size={18}
                  className="text-blue-400 mt-1 group-hover:scale-110 transition-transform"
                />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                  123 Design Street
                  <br />
                  Creative City, CC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone
                  size={18}
                  className="text-green-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                  9744395412
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail
                  size={18}
                  className="text-purple-400 group-hover:scale-110 transition-transform"
                />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                  nestify@gmail.con
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center"></div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700/50 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-blue-300 transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-blue-300 transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:text-blue-300 transition-colors">
                Cookie Policy
              </a>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <span className="text-sm">Crafted with</span>
              <Heart
                size={16}
                className="text-red-400 animate-pulse"
                fill="currentColor"
              />
              <span className="text-sm">for your home</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
