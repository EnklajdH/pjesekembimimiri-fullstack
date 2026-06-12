import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageUrl";

const fallbackImage =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const categoryName = product.category?.parent?.name
    ? `${product.category.parent.name} > ${product.category.name}`
    : product.category?.name || "Pa kategori";

  const isUnavailable = Number(product.stock || 0) <= 0 || product.status === "sold";

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-full">
      <Link
        to={`/products/${product.id}`}
        className="h-48 sm:h-56 md:h-60 overflow-hidden block bg-gray-100"
      >
        <img
          src={getImageUrl(product.image)}
          alt={product.title}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </Link>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <p className="text-sm text-red-600 font-semibold line-clamp-1">
          {product.model}
        </p>

        <h3 className="text-base sm:text-lg font-bold mt-1 mb-2 flex-1 line-clamp-2">
          {product.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {categoryName}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-lg sm:text-xl font-bold break-words">
            {Number(product.price)} {product.currency}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 whitespace-nowrap"
          >
            Shiko
          </Link>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={isUnavailable}
          className="mt-4 w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold"
        >
          <ShoppingCart size={18} />

          {isUnavailable ? "Nuk ka stok" : "Shto në shportë"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
