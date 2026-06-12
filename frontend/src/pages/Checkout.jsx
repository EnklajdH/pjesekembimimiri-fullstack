import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, User, UserPlus } from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/imageUrl";

const fallbackImage =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=300&q=80";

function Checkout() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const { cart, total, currency, clearCart } = useCart();

  const [continueAsGuest, setContinueAsGuest] = useState(false);
  const [loading, setLoading] = useState(false);

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "whatsapp",
  });

  useEffect(() => {
    if (currentUser) {
      setCustomerData((prev) => ({
        ...prev,
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || prev.phone || "",
        address: currentUser.address || prev.address || "",
      }));
    }
  }, [currentUser]);

  function handleChange(e) {
    const { name, value } = e.target;

    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function buildWhatsAppMessage(order) {
    const itemsText = order.items
      .map((item, index) => {
        return `${index + 1}. ${item.product_title}
Modeli: ${item.product_model}
Sasia: ${item.quantity}
Çmimi: ${item.price} ${item.currency}`;
      })
      .join("\n\n");

    return `Pershendetje, dua te bej nje porosi te Pjese Kembimi Miri.

Te dhenat e klientit:
Emri: ${order.customer_name}
Email: ${order.customer_email || "Nuk u vendos"}
Telefoni: ${order.customer_phone}
Adresa: ${order.customer_address}
Qyteti: ${order.customer_city || "Nuk u vendos"}
Shenime: ${order.notes || "Nuk ka"}

Produktet:
${itemsText}

Totali: ${order.total} ${order.currency}

Metoda e porosise: WhatsApp

Numri i porosise: #${order.id}`;
  }

  async function submitOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
      return alert("Shporta është bosh.");
    }

    if (!customerData.name || !customerData.phone || !customerData.address) {
      return alert("Plotëso emrin, telefonin dhe adresën.");
    }

    const payload = {
      customer_name: customerData.name,
      customer_email: customerData.email || null,
      customer_phone: customerData.phone,
      customer_city: customerData.city || null,
      customer_address: customerData.address,
      notes: customerData.notes || null,
      currency,
      payment_method: "whatsapp",
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
      })),
    };

    try {
      setLoading(true);

      const response = await api.post("/orders", payload);
      const order = response.data.order;

      const message = buildWhatsAppMessage(order);
      const encodedMessage = encodeURIComponent(message);

      window.open(
        `https://wa.me/355692902694?text=${encodedMessage}`,
        "_blank"
      );

      clearCart();

      if (currentUser) {
        navigate("/orders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Order error:", error.response || error);

      const message =
        error.response?.data?.message ||
        "Porosia nuk u realizua. Kontrollo të dhënat ose stokun e produktit.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Shporta është bosh
          </h1>

          <p className="text-gray-600 mb-6">
            Shto një pjesë në shportë për të vazhduar me porosinë.
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

  if (!currentUser && !continueAsGuest) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Vazhdo blerjen
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
            <User className="text-red-600 mb-4" size={40} />

            <h2 className="text-2xl font-bold mb-3">Login</h2>

            <p className="text-gray-600 mb-6">
              Hyr në llogari për të ruajtur historikun e porosive.
            </p>

            <Link
              to="/login"
              className="block text-center bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
            >
              Login
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
            <UserPlus className="text-red-600 mb-4" size={40} />

            <h2 className="text-2xl font-bold mb-3">Krijo llogari</h2>

            <p className="text-gray-600 mb-6">
              Regjistrohu që porositë e tua të ruhen në profil.
            </p>

            <Link
              to="/register"
              className="block text-center bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
            >
              Register
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
            <MessageCircle className="text-green-600 mb-4" size={40} />

            <h2 className="text-2xl font-bold mb-3">Vazhdo si guest</h2>

            <p className="text-gray-600 mb-6">
              Bëj porosinë pa krijuar llogari. Historiku nuk ruhet në profil.
            </p>

            <button
              onClick={() => setContinueAsGuest(true)}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
            >
              Vazhdo si guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">
        Të dhënat e blerjes
      </h1>

      {!currentUser && continueAsGuest && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4 sm:p-5 mb-6">
          Po vazhdon si guest. Porosia do regjistrohet në sistem, por nuk do të
          lidhet me një profil klienti.
        </div>
      )}

      {currentUser && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 sm:p-5 mb-6">
          Je loguar si <strong>{currentUser.name}</strong>. Kjo porosi do ruhet
          në historikun tënd.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={submitOrder}
          className="lg:col-span-2 bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            Informacioni i klientit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-bold">Emri i plotë</label>
              <input
                name="name"
                className="w-full border px-4 py-3 rounded-lg mt-2"
                value={customerData.name}
                onChange={handleChange}
                placeholder="P.sh. Enklajd Hodo"
              />
            </div>

            <div>
              <label className="font-bold">Email</label>
              <input
                name="email"
                type="email"
                className="w-full border px-4 py-3 rounded-lg mt-2"
                value={customerData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="font-bold">Telefon / WhatsApp</label>
              <input
                name="phone"
                className="w-full border px-4 py-3 rounded-lg mt-2"
                value={customerData.phone}
                onChange={handleChange}
                placeholder="+355 69 ..."
              />
            </div>

            <div>
              <label className="font-bold">Qyteti</label>
              <input
                name="city"
                className="w-full border px-4 py-3 rounded-lg mt-2"
                value={customerData.city}
                onChange={handleChange}
                placeholder="Tiranë, Durrës..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold">Adresa e dorëzimit</label>
              <input
                name="address"
                className="w-full border px-4 py-3 rounded-lg mt-2"
                value={customerData.address}
                onChange={handleChange}
                placeholder="Rruga, lagjja, pallati..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold">Shënime shtesë</label>
              <textarea
                name="notes"
                className="w-full border px-4 py-3 rounded-lg mt-2 h-28 resize-none"
                value={customerData.notes}
                onChange={handleChange}
                placeholder="P.sh. dua të më kontaktoni para dërgesës..."
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-5">Metoda e porosisë</h2>

          <div className="border border-green-200 bg-green-50 rounded-2xl p-5 mb-8">
            <div className="flex items-start sm:items-center gap-3">
              <MessageCircle
                className="text-green-600 flex-shrink-0 mt-1 sm:mt-0"
                size={28}
              />

              <div>
                <h3 className="font-bold text-green-800">
                  Porosi në WhatsApp
                </h3>

                <p className="text-green-700 text-sm mt-1">
                  Për momentin porositë konfirmohen vetëm përmes WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <MessageCircle size={20} />
            {loading ? "Duke konfirmuar..." : "Konfirmo dhe porosit në WhatsApp"}
          </button>
        </form>

        <aside className="bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8 h-fit lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold mb-6">
            Përmbledhja e shportës
          </h2>

          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b pb-4 last:border-b-0"
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold line-clamp-2">{item.title}</h3>

                  <p className="text-sm text-gray-500">{item.model}</p>
                  <p className="text-sm text-gray-500">Sasia: {item.qty}</p>

                  <p className="font-bold">
                    {item.price} {item.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-5">
            <div className="flex justify-between gap-4 text-lg font-bold">
              <span>Totali</span>

              <span className="text-right">
                {total} {currency}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;

