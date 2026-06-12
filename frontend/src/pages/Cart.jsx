
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageUrl";

const fallbackImage =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=300&q=80";

function Cart() {
  const { cart, updateQty, removeFromCart, total, currency } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Shporta</h1>

        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            Shporta është bosh
          </h2>

          <p className="text-gray-600 mb-6">
            Shto pjesë nga katalogu dhe pastaj porosit në WhatsApp.
          </p>

          <Link
            to="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600"
          >
            Shiko pjesët
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">Shporta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                className="w-full sm:w-28 h-44 sm:h-24 object-cover rounded-xl bg-gray-100"
              />

              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg leading-snug">
                  {item.title}
                </h2>

                <p className="text-gray-500 mt-1">{item.model}</p>

                <p className="font-bold mt-1">
                  {item.price} {item.currency}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateQty(item.id, e.target.value)}
                  className="w-24 border rounded-lg px-3 py-2"
                />

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 p-2 bg-red-50 rounded-lg hover:bg-red-100"
                  aria-label="Remove item"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white rounded-2xl shadow p-5 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold mb-4">Totali</h2>

          <div className="flex justify-between gap-4 text-xl font-bold mb-6">
            <span>Total:</span>
            <span className="text-right">
              {total} {currency}
            </span>
          </div>

          <Link
            to="/checkout"
            className="block bg-green-600 text-white text-center py-4 rounded-lg font-bold hover:bg-green-700"
          >
            Vazhdo te porosia në WhatsApp
          </Link>

          <Link
            to="/products"
            className="block mt-3 bg-black text-white text-center py-4 rounded-lg font-bold hover:bg-gray-800"
          >
            Shto pjesë të tjera
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
