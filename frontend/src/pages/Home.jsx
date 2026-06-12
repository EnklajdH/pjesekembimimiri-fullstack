import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";

import ProductCard from "../components/ProductCard";
import api from "../api/axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const productsResponse = await api.get("/products");
        const categoriesResponse = await api.get("/categories");

        setProducts(productsResponse.data.products || []);
        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.log("Home data error:", error.response || error);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <p className="text-red-500 font-bold mb-3">
              Pjesë origjinale nga Gjermania
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Pjesë këmbimi Mercedes-Benz të përdorura
            </h1>

            <p className="text-gray-200 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl">
              Gjithmonë pjesë këmbimi origjinale të përdorura nga Gjermania.
              Për C-Class, E-Class, ML dhe GLK.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-red-600 text-white px-7 py-4 rounded-lg font-bold hover:bg-red-700 text-center"
              >
                Shiko pjesët
              </Link>

              <a
                href="https://wa.me/355692902694"
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 text-white px-7 py-4 rounded-lg font-bold hover:bg-green-700 text-center"
              >
                Porosit në WhatsApp
              </a>
            </div>
          </div>

          <div className="bg-black/40 rounded-3xl p-3 sm:p-5 md:p-6 shadow-2xl">
            <img
              src="https://mbspecialist.com/media/u2zhfx55/setratiosize800800-goerloese-autoimport-mercedes-reservedelslager-6.jpg?width=1050&height=699&mode=max"
              alt="Mercedes parts"
              className="rounded-2xl w-full h-[260px] sm:h-[340px] md:h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Kërko pjesë..."
            className="border rounded-lg px-4 py-3 w-full"
          />

          <select className="border rounded-lg px-4 py-3 w-full">
            <option>Zgjidh modelin</option>
            <option>C-Class W203</option>
            <option>C-Class W204</option>
            <option>C-Class W205</option>
            <option>E-Class W211</option>
            <option>E-Class W212</option>
            <option>E-Class W213</option>
            <option>ML-Class</option>
            <option>GLK-Class</option>
          </select>

          <select className="border rounded-lg px-4 py-3 w-full">
            <option>Zgjidh kategorinë</option>
            {categories.map((category) => (
              <option key={category.id}>{category.name}</option>
            ))}
          </select>

          <Link
            to="/products"
            className="bg-black text-white rounded-lg px-4 py-3 text-center font-bold hover:bg-red-600"
          >
            Kërko
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-10">
          Modelet që mbulojmë
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {[
            "C-Class W203 / W204 / W205",
            "E-Class W211 / W212 / W213",
            "ML-Class",
            "GLK-Class",
          ].map((model) => (
            <div
              key={model}
              className="bg-white rounded-2xl p-6 md:p-8 shadow text-center hover:shadow-lg"
            >
              <h3 className="text-lg md:text-xl font-bold">{model}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-10">
            Kategoritë kryesore
          </h2>

          {categories.filter((category) => !category.parent_id).length === 0 ? (
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <p className="text-gray-600">
                Kategoritë e shtuara nga admini do shfaqen këtu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {categories
                .filter((category) => !category.parent_id)
                .map((category) => (
                  <Link
                    to="/products"
                    key={category.id}
                    className="bg-gray-100 rounded-2xl p-6 md:p-8 text-center font-bold hover:bg-black hover:text-white transition"
                  >
                    {category.name}
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Pjesë të zgjedhura
          </h2>

          <Link to="/products" className="text-red-600 font-bold">
            Shiko të gjitha
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Nuk ka pjesë aktive për momentin
            </h3>

            <p className="text-gray-600">
              Pjesët e shtuara nga admini do shfaqen këtu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-black text-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 rounded-2xl p-6 md:bg-transparent md:p-0">
            <ShieldCheck className="text-red-600 mb-4" size={40} />

            <h3 className="font-bold text-xl mb-2">Origjinale</h3>

            <p className="text-gray-300">
              Pjesë Mercedes-Benz origjinale të përdorura.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 md:bg-transparent md:p-0">
            <Truck className="text-red-600 mb-4" size={40} />

            <h3 className="font-bold text-xl mb-2">Nga Gjermania</h3>

            <p className="text-gray-300">Import direkt nga Gjermania.</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 md:bg-transparent md:p-0">
            <MessageCircle className="text-red-600 mb-4" size={40} />

            <h3 className="font-bold text-xl mb-2">WhatsApp</h3>

            <p className="text-gray-300">
              Porosit shpejt dhe konfirmo çdo pjesë në WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

