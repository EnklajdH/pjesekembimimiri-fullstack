import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  async function loadProducts() {
    try {
      const params = {};

      if (selectedModel) {
        params.model = selectedModel;
      }

      if (selectedCategory) {
        params.category_id = selectedCategory;
      }

      if (search) {
        params.search = search;
      }

      const response = await api.get("/products", { params });
      setProducts(response.data.products || []);
    } catch (error) {
      console.log("Products error:", error.response || error);
    }
  }

  async function loadCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.log("Categories error:", error.response || error);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedModel, selectedCategory]);

  function handleSearch(e) {
    e.preventDefault();
    loadProducts();
  }

  function clearFilters() {
    setSearch("");
    setSelectedModel("");
    setSelectedCategory("");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Pjesët e këmbimit
        </h1>

        <p className="text-gray-600 text-base sm:text-lg">
          Zgjidh pjesë sipas modelit, kategorisë ose kërko direkt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="bg-white rounded-2xl shadow p-5 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-bold mb-5">Filtro</h2>

          <form onSubmit={handleSearch}>
            <div className="mb-5">
              <label className="font-semibold text-sm">Kërko</label>

              <input
                type="text"
                placeholder="P.sh. fener, pasqyrë, parakolp..."
                className="w-full border rounded-lg px-4 py-3 mt-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="font-semibold text-sm">Modeli</label>

              <select
                className="w-full border rounded-lg px-4 py-3 mt-2"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="">Të gjitha</option>
                <option value="C-Class W203">C-Class W203</option>
                <option value="C-Class W204">C-Class W204</option>
                <option value="C-Class W205">C-Class W205</option>
                <option value="E-Class W211">E-Class W211</option>
                <option value="E-Class W212">E-Class W212</option>
                <option value="E-Class W213">E-Class W213</option>
                <option value="ML-Class">ML-Class</option>
                <option value="GLK-Class">GLK-Class</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="font-semibold text-sm">Kategoria</label>

              <select
                className="w-full border rounded-lg px-4 py-3 mt-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Të gjitha</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.parent_id ? "— " : ""}
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700"
              >
                Kërko
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800"
              >
                Pastro filtrat
              </button>
            </div>
          </form>
        </aside>

        <section className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="font-semibold">
              {products.length} pjesë u gjetën
            </div>

            <p className="text-sm text-gray-500">
              Rezultatet për pjesët Mercedes-Benz
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-10 text-center shadow">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Nuk u gjet asnjë pjesë
              </h2>

              <p className="text-gray-600">
                Provo një model ose kategori tjetër.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Products;
