
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../Api/Axios-instance";
import Sidebar from "./Sidebar";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  // Modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/productes");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/productes/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        setError("Error deleting product: " + err.message);
      }
    }
  };

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditedProduct({ ...product });
  };

  // Handle edit form change
  const handleEditChange = (field, value) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  // Save edited product
  const saveEditedProduct = async () => {
    try {
      const response = await api.put(`/productes/${editingProduct.id}`, editedProduct);
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? response.data : p
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProduct(null);
    } catch (err) {
      alert("Error updating product: " + err.message);
    }
  };

  // Pagination handler
  const paginate = (page) => setCurrentPage(page);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading products...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-2 text-lg font-medium">
            Error loading products
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="text-xl">☰</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/addproduct")}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <Filter className="text-gray-400 w-5 h-5" />
              {/* <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all"
                      ? "All Categories"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select> */}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    <img
                      src={
                        product.img ||
                        `https://via.placeholder.com/300x200?text=${encodeURIComponent(
                          product.name
                        )}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg truncate flex-1">
                        {product.name}
                      </h3>
                      <span className="text-blue-600 font-bold ml-2">
                        ₹{product.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
            
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 max-h-[90vh] overflow-auto">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={editedProduct.name || ""}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="border border-gray-300 rounded-xl p-2"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editedProduct.price || 0}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  className="border border-gray-300 rounded-xl p-2"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={editedProduct.category || ""}
                  onChange={(e) => handleEditChange("category", e.target.value)}
                  className="border border-gray-300 rounded-xl p-2"
                />
                <textarea
                  placeholder="Description"
                  value={editedProduct.description || ""}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="border border-gray-300 rounded-xl p-2"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={editedProduct.img || ""}
                  onChange={(e) => handleEditChange("img", e.target.value)}
                  className="border border-gray-300 rounded-xl p-2"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-2 rounded-xl bg-gray-200"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white"
                  onClick={saveEditedProduct}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
