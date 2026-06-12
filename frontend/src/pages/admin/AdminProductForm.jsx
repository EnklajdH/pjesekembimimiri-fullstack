import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import { carModels } from "../../data/seed";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";

const emptyProduct = {
  title: "",
  category_id: "",
  model: "C-Class W204",
  price: "",
  currency: "EUR",
  stock: 1,
  condition: "E përdorur origjinale",
  origin: "Gjermani",
  oem: "",
  status: "active",
  image: "",
  image_file: null,
  description: "",
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  async function loadInitialData() {
    try {
      const categoriesResponse = await api.get("/categories");
      setCategories(categoriesResponse.data.categories || []);

      if (id) {
        const productsResponse = await api.get("/admin/products");

        const found = productsResponse.data.products.find(
          (product) => Number(product.id) === Number(id)
        );

        if (found) {
          setForm({
            title: found.title || "",
            category_id: found.category_id || "",
            model: found.model || "C-Class W204",
            price: found.price || "",
            currency: found.currency || "EUR",
            stock: found.stock ?? 1,
            condition: found.condition || "E përdorur origjinale",
            origin: found.origin || "Gjermani",
            oem: found.oem || "",
            status: found.status || "active",
            image: found.image || "",
            image_file: null,
            description: found.description || "",
          });
        }
      }
    } catch (error) {
      console.log("Product form load error:", error.response || error);
      alert("Nuk u ngarkuan të dhënat e produktit.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Ju lutem zgjidhni vetëm file imazhi.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image_file: file,
      image: previewUrl,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.title || !form.category_id || !form.price) {
      return alert("Plotëso titullin, kategorinë dhe çmimin.");
    }

    const payload = new FormData();

    payload.append("category_id", Number(form.category_id));
    payload.append("title", form.title);
    payload.append("model", form.model);
    payload.append("price", Number(form.price));
    payload.append("currency", form.currency);
    payload.append("stock", Number(form.stock || 0));
    payload.append("condition", form.condition || "E përdorur origjinale");
    payload.append("origin", form.origin || "Gjermani");
    payload.append("oem", form.oem || "");
    payload.append("status", form.status);
    payload.append("description", form.description || "");

    if (form.image_file) {
      payload.append("image_file", form.image_file);
    } else if (form.image && !form.image.startsWith("blob:")) {
      payload.append("image", form.image);
    }

    try {
      setLoading(true);

      if (id) {
        payload.append("_method", "PUT");

        await api.post(`/admin/products/${id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/admin/products", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/admin/products");
    } catch (error) {
      console.log("Product save error:", error.response || error);

      const message =
        error.response?.data?.message ||
        "Produkti nuk u ruajt. Kontrollo të dhënat.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          {id ? "Edito pjesë" : "Shto pjesë"}
        </h1>

        <p className="text-gray-600 mt-2">
          Plotëso të dhënat e pjesës dhe ngarko foton e produktit.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="font-bold">Titulli</label>
            <input
              name="title"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              placeholder="P.sh. Parakolp para Mercedes C-Class W204"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-bold">Kategoria</label>
            <select
              name="category_id"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">Zgjidh kategori</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.parent_id ? "— " : ""}
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold">Modeli</label>
            <select
              name="model"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.model}
              onChange={handleChange}
            >
              {carModels.map((model) => (
                <option key={model}>{model}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold">Çmimi</label>
            <input
              name="price"
              type="number"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-bold">Monedha</label>
            <select
              name="currency"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.currency}
              onChange={handleChange}
            >
              <option>EUR</option>
              <option>ALL</option>
            </select>
          </div>

          <div>
            <label className="font-bold">Stoku</label>
            <input
              name="stock"
              type="number"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-bold">Statusi</label>
            <select
              name="status"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">active</option>
              <option value="hidden">hidden</option>
              <option value="sold">sold</option>
            </select>
          </div>

          <div>
            <label className="font-bold">Gjendja</label>
            <input
              name="condition"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.condition}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-bold">Origjina</label>
            <input
              name="origin"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.origin}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-bold">Kodi OEM</label>
            <input
              name="oem"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              value={form.oem}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold">Foto e produktit</label>

            <input
              type="file"
              accept="image/*"
              className="w-full border px-4 py-3 rounded-lg mt-2"
              onChange={handleImageUpload}
            />

            <p className="text-center text-gray-400 my-3">ose</p>

            <input
              name="image"
              className="w-full border px-4 py-3 rounded-lg"
              placeholder="Vendos URL të fotos: https://..."
              value={form.image.startsWith("blob:") ? "" : form.image}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.value,
                  image_file: null,
                }))
              }
            />

            {form.image && (
              <div className="mt-5">
                <p className="text-sm font-bold mb-2">Preview foto:</p>

                <img
                  src={getImageUrl(form.image)}
                  alt="Preview"
                  className="w-full max-h-64 sm:max-h-80 object-cover rounded-xl border"
                />

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      image: "",
                      image_file: null,
                    }))
                  }
                  className="mt-3 w-full sm:w-auto bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Hiq foton
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="font-bold">Përshkrimi</label>
            <textarea
              name="description"
              className="w-full border px-4 py-3 rounded-lg mt-2 h-32 resize-none"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              disabled={loading}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Duke ruajtur..." : "Ruaj pjesën"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800"
            >
              Anulo
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminProductForm;

