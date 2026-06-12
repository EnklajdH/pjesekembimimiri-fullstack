import { useEffect, useState } from "react";

import AdminLayout from "./AdminLayout";
import api from "../../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const response = await api.get("/admin/orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("Admin orders error:", error.response || error);

      const message =
        error.response?.data?.message || "Nuk u ngarkuan porositë.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId, newStatus) {
    try {
      await api.put(`/admin/orders/${orderId}`, {
        status: newStatus,
      });

      await loadOrders();
    } catch (error) {
      console.log("Update order status error:", error.response || error);

      const message =
        error.response?.data?.message ||
        "Statusi i porosisë nuk u ndryshua.";

      alert(message);
    }
  }

  async function deleteOrder(orderId) {
    const confirmDelete = window.confirm(
      "A je i sigurt që do ta fshish këtë porosi?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/orders/${orderId}`);
      await loadOrders();
    } catch (error) {
      console.log("Delete order error:", error.response || error);

      const message =
        error.response?.data?.message || "Porosia nuk u fshi.";

      alert(message);
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("sq-AL", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function statusColor(status) {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    if (status === "shipped") return "bg-blue-100 text-blue-700";
    if (status === "processing") return "bg-purple-100 text-purple-700";
    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Porositë</h1>

          <p className="text-gray-600 mt-2">
            Menaxho porositë reale nga klientët dhe guest users.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow px-5 py-3 w-full sm:w-auto">
          <p className="text-gray-500 text-sm">Total porosi</p>
          <h2 className="text-2xl font-bold">{orders.length}</h2>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow p-8">
          <p className="font-bold">Duke ngarkuar porositë...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Nuk ka porosi akoma</h2>

          <p className="text-gray-600">
            Porositë që bëhen nga checkout do shfaqen këtu.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow p-5 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold">Porosia #{order.id}</h2>

                  <p className="text-gray-500 mt-1">
                    Data: {formatDate(order.created_at)}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        order.order_type === "guest"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.order_type === "guest"
                        ? "Guest checkout"
                        : "Customer account"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border px-4 py-3 rounded-lg w-full"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-red-700"
                  >
                    Fshi
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-6">
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Klienti</p>
                  <h3 className="font-bold break-words">
                    {order.customer_name || "Pa emër"}
                  </h3>
                </div>

                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Telefoni</p>
                  <h3 className="font-bold break-words">
                    {order.customer_phone || "N/A"}
                  </h3>
                </div>

                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Email</p>
                  <h3 className="font-bold break-all">
                    {order.customer_email || "N/A"}
                  </h3>
                </div>

                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Adresa</p>
                  <h3 className="font-bold break-words">
                    {order.customer_address || "N/A"}
                  </h3>
                </div>

                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Qyteti</p>
                  <h3 className="font-bold break-words">
                    {order.customer_city || "N/A"}
                  </h3>
                </div>

                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Pagesa</p>
                  <h3 className="font-bold break-words">
                    {order.payment_method} / {order.payment_status}
                  </h3>
                </div>
              </div>

              {order.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-yellow-800 break-words">
                    <strong>Shënime:</strong> {order.notes}
                  </p>
                </div>
              )}

              <h3 className="text-xl font-bold mb-4">Produktet</h3>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-xl p-4"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-lg break-words">
                        {item.product_title}
                      </h4>

                      <p className="text-gray-600">
                        Modeli: {item.product_model || "N/A"}
                      </p>

                      <p className="text-gray-600">Sasia: {item.quantity}</p>
                    </div>

                    <p className="font-bold sm:text-right whitespace-nowrap">
                      {Number(item.price)} {item.currency}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-5 flex justify-end">
                <div className="text-right">
                  <p className="text-gray-500">Totali</p>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {Number(order.total)} {order.currency}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;

