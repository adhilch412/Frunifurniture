import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Nav from './Navbar/Nav';
import Footer from './Component/Footer';
import Home from './Component/Home';
import About from './Component/About';
import Shop from './Sales/Shop';
import Contact from './cont/Contact';
import Login from './log/Login';
import Sign from './Navbar/Signup/Sign';
import Cart from './Component/Cart';
import Wishlist from './Component/Whishlist';
import Profile from './Component/Profile';
import ProductDetail from './Sales/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './Context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/contact' element={<Contact />} />
            <Route 
              path='/login' 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/sign' 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Sign />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/cart' 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/wishlist' 
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/profile' 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path='/product/:id' element={<ProductDetail />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </div>
    </CartProvider>
  );
}

export default App;