// import React, { useContext } from "react";
// import { WishlistContext } from "../Context/Whishcontext"; 
// import { FaTrash } from "react-icons/fa";

// export default function Wishlist() {
//   const { wishlist, removeFromWishlist } = useContext(WishlistContext);

//   return (
//     <div className="bg-gray-50 min-h-screen py-12">
//       <div className="max-w-7xl mx-auto px-6">
//         <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
//           ❤️ Your Wishlist ({wishlist.length} {wishlist.length === 1 ? "item" : "items"})
//         </h1>

//         {wishlist.length === 0 ? (
//           <p className="text-center text-gray-500 text-lg">
//             Your wishlist is empty. Start adding some products!
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {wishlist.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-xl transition"
//               >
//                 <img
//                   src={item.img}
//                   alt={item.name}
//                   className="w-48 h-48 object-cover rounded mb-4"
//                 />
//                 <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
//                 <p className="text-indigo-600 font-bold mb-4">${item.price}</p>
//                 <button
//                   onClick={() => removeFromWishlist(item.id)}
//                   className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
//                 >
//                   <FaTrash className="mr-2" />
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useContext } from "react";
import { WishlistContext } from "../Context/Whishcontext";
import { FaTrash } from "react-icons/fa";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          ❤️ Your Wishlist ({wishlist.length}{" "}
          {wishlist.length === 1 ? "item" : "items"})
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your wishlist is empty. Start adding some favorites!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-xl transition"
              >
                <img
                  src={item.img || "https://via.placeholder.com/200"}
                  alt={item.name}
                  className="w-48 h-48 object-cover rounded mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-indigo-600 font-bold mb-4">{item.price}</p>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                >
                  <FaTrash className="mr-2" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
