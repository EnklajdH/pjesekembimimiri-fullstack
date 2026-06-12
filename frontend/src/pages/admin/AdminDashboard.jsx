import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import api from "../../api/axios";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboardData() {
    try {
      const [productsResponse, categoriesResponse, ordersResponse] =
        await Promise.all([
          api.get("/admin/products"),
          api.get("/categories"),
          api.get("/admin/orders"),
        ]);

      setProducts(productsResponse.data.products || []);
      setCategories(categoriesResponse.data.categories || []);
      setOrders(ordersResponse.data.orders || []);
    } catch (error) {
      console.log("Dashboard error:", error.response || error);

      const message =
        error.response?.data?.message ||
        "Dashboard nuk u ngarkua. Kontrollo backend-in ose login-in admin.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalStock = products.reduce((total, product) => {
    return total + Number(product.stock || 0);
  }, 0);

  const activeProducts = products.filter(
    (product) => product.status === "active"
  ).length;

  const soldProducts = products.filter(
    (product) => product.status === "sold"
  ).length;

  const hiddenProducts = products.filter(
    (product) => product.status === "hidden"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed"
  ).length;

  const lowStockProducts = products.filter((product) => {
    const stock = Number(product.stock || 0);
    return stock > 0 && stock <= 2;
  });

  const revenueByCurrency = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((totals, order) => {
      const orderCurrency = order.currency || "ALL";
      const amount = Number(order.total || 0);

      if (!totals[orderCurrency]) {
        totals[orderCurrency] = 0;
      }

      totals[orderCurrency] += amount;

      return totals;
    }, {});

  const revenueALL = revenueByCurrency.ALL || 0;
  const revenueEUR = revenueByCurrency.EUR || 0;

  const latestOrders = orders.slice(0, 5);

  function formatDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("sq-AL", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Duke ngarkuar statistikat...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Përmbledhje reale nga database e Pjesë Këmbimi Miri.
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 text-center"
        >
          Shto pjesë
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Produkte totale</p>
          <h2 className="text-3xl font-bold">{products.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Kategori</p>
          <h2 className="text-3xl font-bold">{categories.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Stok total</p>
          <h2 className="text-3xl font-bold">{totalStock}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Porosi totale</p>
          <h2 className="text-3xl font-bold">{orders.length}</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-green-700">Produkte aktive</p>
          <h2 className="text-3xl font-bold text-green-700">
            {activeProducts}
          </h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-700">Produkte sold</p>
          <h2 className="text-3xl font-bold text-red-700">{soldProducts}</h2>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-700">Produkte hidden</p>
          <h2 className="text-3xl font-bold text-gray-700">
            {hiddenProducts}
          </h2>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-700">Porosi pending</p>
          <h2 className="text-3xl font-bold text-yellow-700">
            {pendingOrders}
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Porosi confirmed</p>
          <h2 className="text-3xl font-bold">{confirmedOrders}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Produkte me stok të ulët</p>
          <h2 className="text-3xl font-bold">{lowStockProducts.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Vlera e porosive</p>

          <div className="mt-2 space-y-1">
            <h2 className="text-2xl font-bold">{revenueALL} ALL</h2>
            <h2 className="text-2xl font-bold">{revenueEUR} EUR</h2>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Porositë e fundit</h2>

          {latestOrders.length === 0 ? (
            <p className="text-gray-600">Nuk ka porosi akoma.</p>
          ) : (
            <div className="space-y-4">
              {latestOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-xl p-4 flex justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold">Porosia #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {order.customer_name || "Pa emër"} ·{" "}
                      {formatDate(order.created_at)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.payment_method} · {order.status}
                    </p>
                  </div>

                  <div className="text-right font-bold">
                    {Number(order.total)} {order.currency}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/admin/orders"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
          >
            Shiko porositë
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-4">
            Produkte me stok të ulët
          </h2>

          {lowStockProducts.length === 0 ? (
            <p className="text-gray-600">
              Nuk ka produkte me stok të ulët për momentin.
            </p>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-xl p-4 flex justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.model}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      Stok: {product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/admin/products"
            className="inline-block mt-6 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
          >
            Menaxho pjesët
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Menaxho pjesët</h2>

          <p className="text-gray-600 mb-6">
            Shto, edito ose fshi pjesë. Çdo pjesë lidhet me kategori dhe model
            makine.
          </p>

          <Link
            to="/admin/products"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
          >
            Hap pjesët
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-4">Menaxho kategoritë</h2>

          <p className="text-gray-600 mb-6">
            Krijo kategori dhe nënkategori si Karroceria &gt; Parakolp.
          </p>

          <Link
            to="/admin/categories"
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
          >
            Hap kategoritë
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;