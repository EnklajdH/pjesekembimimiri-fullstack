import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import api from "../../api/axios";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.log("Admin categories error:", error.response || error);
      alert("Nuk u ngarkuan kategoritë.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function getParentName(category) {
    if (!category.parent_id) {
      return "Kategori kryesore";
    }

    return category.parent?.name || "Pa parent";
  }

  async function deleteCategory(id) {
    const confirmDelete = window.confirm(
      "A je i sigurt që do ta fshish këtë kategori?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      await loadCategories();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Kategoria nuk u fshi. Kontrollo nëse ka produkte ose nënkategori.";

      alert(message);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Kategoritë</h1>

          <p className="text-gray-600 mt-2">
            Menaxho kategori dhe nënkategori për pjesët e automjeteve.
          </p>
        </div>

        <Link
          to="/admin/categories/create"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 text-center"
        >
          Shto kategori
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow p-8">
          <p className="font-bold">Duke ngarkuar kategoritë...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Nuk ka kategori akoma</h2>

          <p className="text-gray-600 mb-6">
            Shto kategorinë e parë, p.sh. Karroceria.
          </p>

          <Link
            to="/admin/categories/create"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700"
          >
            Shto kategori
          </Link>
        </div>
      ) : (
        <>
          <div className="block md:hidden space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      ID #{category.id}
                    </p>

                    <h2 className="text-xl font-bold break-words">
                      {category.parent_id ? "— " : ""}
                      {category.name}
                    </h2>
                  </div>

                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    {category.parent_id ? "Nënkategori" : "Kryesore"}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-gray-500">Parent</p>
                    <p className="font-bold">{getParentName(category)}</p>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-gray-500">Slug</p>
                    <p className="font-bold break-all">{category.slug}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link
                    to={`/admin/categories/edit/${category.id}`}
                    className="bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 text-center font-bold"
                  >
                    Edito
                  </Link>

                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 font-bold"
                  >
                    Fshi
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-left min-w-[760px]">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Emri</th>
                  <th className="p-4">Parent</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4 text-right">Veprime</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold">{category.id}</td>

                    <td className="p-4">
                      <span className="font-bold">
                        {category.parent_id ? "— " : ""}
                        {category.name}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {getParentName(category)}
                    </td>

                    <td className="p-4 text-gray-600">{category.slug}</td>

                    <td className="p-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/categories/edit/${category.id}`}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        >
                          Edito
                        </Link>

                        <button
                          onClick={() => deleteCategory(category.id)}
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

export default AdminCategories;

