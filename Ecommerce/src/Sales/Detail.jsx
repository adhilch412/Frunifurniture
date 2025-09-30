// import React, { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { CartContext } from "../Context/CartContext";
// import { WishlistContext } from "../Context/Whishcontext";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import api from "../Api/Axios-instance";

// export default function Detail() {
//   const { id } = useParams(); // get product id from URL
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { addToCart, userId } = useContext(CartContext);
//   const { wishlist, toggleWishlist } = useContext(WishlistContext);

//   // Fetch product by ID
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await api.get(`/productes/${id}`); // fetch product from JSON server
//         setProduct(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (loading) {
//     return <div className="text-center mt-32 text-gray-500">Loading product...</div>;
//   }

//   if (!product) {
//     return <div className="text-center mt-32 text-red-500">Product not found!</div>;
//   }

//   const isFavorite = wishlist.find((w) => w.id === product.id);

//   const handleAddToCart = () => {
//     if (!userId) {
//       alert("Please login to add products to cart!");
//       return;
//     }
//     addToCart(product);
//     alert(`${product.name} added to cart!`);
//   };

//   const handleWishlistToggle = () => {
//     if (!userId) {
//       alert("Please login to manage wishlist!");
//       return;
//     }
//     toggleWishlist(product);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
//         {/* Product Image */}
//         <div className="md:w-1/2 flex justify-center">
//           <img
//             src={product.img || "https://via.placeholder.com/400x300?text=No+Image"}
//             alt={product.name}
//             className="rounded-xl object-cover max-h-96"
//           />
//         </div>

//         {/* Product Info */}
//         <div className="md:w-1/2 flex flex-col justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
//             <p className="text-indigo-600 font-bold text-2xl mb-4">{product.price}</p>
//             {product.description && (
//               <p className="text-gray-700 mb-6">{product.description}</p>
//             )}
//           </div>

//           <div className="flex items-center gap-4 mt-4">
//             <button
//               onClick={handleAddToCart}
//               className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
//             >
//               Add to Cart
//             </button>

//             <button
//               onClick={handleWishlistToggle}
//               className={`p-3 rounded-full transition shadow-lg ${
//                 isFavorite
//                   ? "bg-red-500 text-white animate-pulse"
//                   : "bg-white text-red-500 hover:bg-red-100"
//               }`}
//             >
//               {isFavorite ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
