import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";

const fallbackImage =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=300&q=80";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      const response = await api.get("/admin/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.log("Admin products error:", error.response || error);
      alert("Nuk u ngarkuan pjesët.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(id) {
    const confirmDelete = window.confirm(
      "A je i sigurt që do ta fshish këtë pjesë?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/products/${id}`);
      await loadProducts();
    } catch (error) {
      const message =
        error.response?.data?.message || "Produkti nuk u fshi.";

      alert(message);
    }
  }

  function statusClass(status) {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "sold") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Pjesët</h1>
          <p className="text-gray-600 mt-2">
            Menaxho pjesët e këmbimit në database.
          </p>
        </div>

        <Link
          to="/admin/products/create"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 text-center"
        >
          Shto pjesë
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow p-8">
          <p className="font-bold">Duke ngarkuar pjesët...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Nuk ka pjesë akoma</h2>

          <p className="text-gray-600 mb-6">
            Shto pjesën e parë, p.sh. Parakolp W204.
          </p>

          <Link
            to="/admin/products/create"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
          >
            Shto pjesë
          </Link>
        </div>
      ) : (
        <>
          <div className="block md:hidden space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="w-24 h-24 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-lg leading-snug break-words">
                      {product.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {product.model}
                    </p>

                    <p className="text-sm text-gray-500">
                      OEM: {product.oem || "N/A"}
                    </p>

                    <p className="font-bold mt-1">
                      {Number(product.price)} {product.currency}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-gray-500">Kategoria</p>
                    <p className="font-bold">
                      {product.category?.name || "Pa kategori"}
                    </p>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-gray-500">Stoku</p>
                    <p className="font-bold">{product.stock}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${statusClass(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                      Edito
                    </Link>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Fshi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-4">Foto</th>
                  <th className="p-4">Titulli</th>
                  <th className="p-4">Modeli</th>
                  <th className="p-4">Kategoria</th>
                  <th className="p-4">Çmimi</th>
                  <th className="p-4">Stoku</th>
                  <th className="p-4">Statusi</th>
                  <th className="p-4 text-right">Veprime</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.title}
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                        className="w-20 h-16 object-cover rounded-lg bg-gray-100"
                      />
                    </td>

                    <td className="p-4">
                      <p className="font-bold">{product.title}</p>
                      <p className="text-sm text-gray-500">
                        OEM: {product.oem || "N/A"}
                      </p>
                    </td>

                    <td className="p-4">{product.model}</td>

                    <td className="p-4">
                      {product.category?.name || "Pa kategori"}
                    </td>

                    <td className="p-4 font-bold">
                      {Number(product.price)} {product.currency}
                    </td>

                    <td className="p-4">{product.stock}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${statusClass(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        >
                          Edito
                        </Link>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Fshi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminProducts;

