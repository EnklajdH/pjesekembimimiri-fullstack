import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageUrl";

const fallbackImage =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.log("Product details error:", error.response || error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">
            Duke ngarkuar produktin...
          </h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Produkti nuk u gjet
          </h1>

          <Link to="/products" className="text-red-600 font-bold">
            Kthehu te produktet
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = product.category?.parent?.name
    ? `${product.category.parent.name} > ${product.category.name}`
    : product.category?.name || "Pa kategori";

  const isOutOfStock =
    Number(product.stock || 0) <= 0 || product.status === "sold";

  const whatsappMessage = encodeURIComponent(
    `Pershendetje, jam i interesuar per kete pjese:\n\n${product.title}\nModeli: ${product.model}\nCmimi: ${product.price} ${product.currency}\nKodi OEM: ${product.oem || "N/A"}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <Link
        to="/products"
        className="inline-block text-red-600 font-bold mb-6 hover:underline"
      >
        ← Kthehu te produktet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <img
            src={getImageUrl(product.image)}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className="w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[560px] object-cover"
          />
        </div>

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8">
          <p className="text-red-600 font-bold mb-2">{product.model}</p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {product.title}
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description || "Nuk ka përshkrim për këtë pjesë."}
          </p>

          <div className="mb-6 space-y-3 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b pb-2">
              <strong>Kategoria:</strong>
              <span className="text-gray-700 sm:text-right">{categoryName}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b pb-2">
              <strong>Gjendja:</strong>
              <span className="text-gray-700">{product.condition}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b pb-2">
              <strong>Origjina:</strong>
              <span className="text-gray-700">{product.origin}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b pb-2">
              <strong>Kodi OEM:</strong>
              <span className="text-gray-700">{product.oem || "N/A"}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b pb-2">
              <strong>Stoku:</strong>
              {isOutOfStock ? (
                <span className="text-red-600 font-bold">Nuk ka stok</span>
              ) : (
                <span className="text-green-600 font-bold">
                  {product.stock}
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 mb-6">
            <p className="text-gray-500 text-sm mb-1">Çmimi</p>
            <div className="text-2xl sm:text-3xl font-bold">
              {Number(product.price)} {product.currency}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              {isOutOfStock ? "Nuk ka stok" : "Shto në shportë"}
            </button>

            <a
              href={`https://wa.me/355692902694?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="block w-full bg-green-600 text-white py-4 rounded-lg font-bold text-center hover:bg-green-700"
            >
              Pyet në WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

