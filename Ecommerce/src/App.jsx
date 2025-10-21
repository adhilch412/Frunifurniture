

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./Component/Footer";
import Home from "./Component/Home";
import About from "./Component/About";
import Shop from "./Sales/Shop";
import Contact from "./Component/Contact";
import Login from "./log/Login";
import Sign from "./log/Signup/Sign";
import Cart from "./Component/Cart";
import Wishlist from "./Component/Whishlist";
import Profile from "./Component/Profile";
import ProductDetail from "./Sales/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ make sure the path is correct (case sensitive)
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/Authcontext";
import Checkout from "./Component/Checkout";
import OrderHistory from "./Component/Orderlist";
import WishlistProvider from "./Context/Whishcontext";
import Navbar from "./Navbar/Nav";
import Allusers from "./admin/Allusers";
import Allorders from "./admin/Allorders";
import Allproduct from './admin/Allproduct'
import Dashboard from "./admin/Dashboard";
import Addproduct from './admin/Addproduct'
import { useEffect } from "react";
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Auto redirect admin after refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (
        user.role?.toLowerCase() === "admin" &&
        (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup")
      ) {
        navigate("/dashbord", { replace: true });
      }
    }
  }, [navigate, location.pathname]);
  // ✅ Hide Navbar & Footer for admin and auth pages
  const hideNavFooterPages = [
    "/login",
    "/sign",
    "/dashbord",
    "/allusers",
    "/allorders",
    '/allproduct',
    '/addproduct',
  ];

  const showNavFooter = !hideNavFooterPages.includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen bg-gray-50">
            {showNavFooter && <Navbar />}

            <main className="flex-1">
              <Routes>
                {/* ====== Public Pages (Guests + Users + Admin) ====== */}
                <Route path="/" element={ <Home />} />
                <Route path="/about" element={<About />}/>
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                {/* ====== Auth Pages (Only for Guests) ====== */}
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute requireAuth={false} allowedRoles="guest">
                      <Login />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sign"
                  element={
                    <ProtectedRoute requireAuth={false} allowedRoles="guest">
                      <Sign />
                    </ProtectedRoute>
                  }
                />

                {/* ====== User-Only Pages ====== */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["user"]}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["user"]}>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["user"]}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["user"]}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orderlist"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["user"]}>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />

                {/* ====== Admin-Only Pages ====== */}
                <Route
                  path="/dashbord"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/allusers"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
                      <Allusers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/allorders"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
                      <Allorders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/allproduct"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
                      <Allproduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addproduct"
                  element={
                    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
                      <Addproduct/>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            {showNavFooter && <Footer />}

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              gutter={8}
              toastOptions={{
                duration: 3000,
                style: {
                  fontSize: "14px",
                  fontWeight: "500",
                },
              }}
            />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
