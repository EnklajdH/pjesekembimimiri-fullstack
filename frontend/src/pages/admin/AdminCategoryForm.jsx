import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import api from "../../api/axios";

function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    parent_id: "",
  });

  const [loading, setLoading] = useState(false);

  async function loadCategories() {
    try {
      const response = await api.get("/categories");
      const allCategories = response.data.categories || [];

      setCategories(allCategories);

      if (id) {
        const found = allCategories.find(
          (category) => Number(category.id) === Number(id)
        );

        if (found) {
          setForm({
            name: found.name,
            parent_id: found.parent_id || "",
          });
        }
      }
    } catch (error) {
      console.log("Category form error:", error.response || error);
      alert("Nuk u ngarkuan kategoritë.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      return alert("Vendos emrin e kategorisë.");
    }

    const payload = {
      name: form.name,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
    };

    try {
      setLoading(true);

      if (id) {
        await api.put(`/admin/categories/${id}`, payload);
      } else {
        await api.post("/admin/categories", payload);
      }

      navigate("/admin/categories");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Kategoria nuk u ruajt. Kontrollo të dhënat.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  const availableParents = categories.filter(
    (category) => Number(category.id) !== Number(id)
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          {id ? "Edito kategori" : "Shto kategori"}
        </h1>

        <p className="text-gray-600 mt-2">
          Krijo kategori kryesore ose nënkategori për pjesët e automjeteve.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8 max-w-3xl"
      >
        <div className="mb-5">
          <label className="font-bold">Emri i kategorisë</label>

          <input
            name="name"
            className="w-full border px-4 py-3 rounded-lg mt-2"
            placeholder="P.sh. Parakolp"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-8">
          <label className="font-bold">Parent category</label>

          <select
            name="parent_id"
            className="w-full border px-4 py-3 rounded-lg mt-2"
            value={form.parent_id}
            onChange={handleChange}
          >
            <option value="">Pa parent - kategori kryesore</option>

            {availableParents.map((category) => (
              <option key={category.id} value={category.id}>
                {category.parent_id ? "— " : ""}
                {category.name}
              </option>
            ))}
          </select>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Nëse zgjedh parent, kjo bëhet nënkategori.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Duke ruajtur..." : "Ruaj kategorinë"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
          >
            Anulo
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminCategoryForm;

