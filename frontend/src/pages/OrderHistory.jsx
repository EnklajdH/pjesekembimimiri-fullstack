import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function OrderHistory() {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const response = await api.get("/my-orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("My orders error:", error.response || error);

      const message =
        error.response?.data?.message ||
        "Nuk u ngarkua historiku i porosive.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadOrders();
    }
  }, [currentUser]);

  function formatDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("sq-AL", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function statusColor(status) {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    if (status === "shipped") return "bg-blue-100 text-blue-700";
    if (status === "processing") return "bg-purple-100 text-purple-700";
    return "bg-yellow-100 text-yellow-700";
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">
            Duke ngarkuar porositë...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <p className="text-red-600 font-bold mb-2">
          Pjesë Këmbimi Miri
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Historiku i porosive
        </h1>

        <p className="text-gray-600">
          Porositë që ke bërë me këtë llogari.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Nuk ke asnjë porosi akoma
          </h2>

          <p className="text-gray-600">
            Porositë që bën me llogari do shfaqen këtu.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow p-5 sm:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold">
                    Porosia #{order.id}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Data: {formatDate(order.created_at)}
                  </p>

                  <p className="text-gray-600">
                    Pagesa: {order.payment_method} / {order.payment_status}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold w-fit ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-bold break-words">
                        {item.product_title}
                      </h3>

                      <p className="text-gray-600 text-sm">
                        Modeli: {item.product_model || "N/A"}
                      </p>

                      <p className="text-gray-600 text-sm">
                        Sasia: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold sm:text-right">
                      {Number(item.price)} {item.currency}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between gap-4">
                <span className="font-bold">Totali</span>

                <span className="font-bold text-lg sm:text-xl text-right">
                  {Number(order.total)} {order.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;

