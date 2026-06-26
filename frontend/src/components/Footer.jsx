import { Link } from 'react-router-dom';
function Footer() {
  return (
  <footer className="bg-black text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-3">
          Pjesë Këmbimi <span className="text-red-600">Miri</span>
        </h2>

        <p className="text-gray-300 max-w-xl">
          Gjithmonë pjesë këmbimi origjinale të përdorura nga Gjermania.
          Specializuar në Mercedes-Benz A-Class, B-Class, C-Class, E-Class,
          CLK, CLS, ML dhe GLK.
        </p>
      </div>

      <div>
        <h3 className="font-bold mb-3">Menu</h3>

        <div className="flex flex-col gap-2 text-gray-300">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/products" className="hover:text-white">
            Pjesë
          </Link>
          <Link to="/contact" className="hover:text-white">
            Kontakt
          </Link>
          <Link to="/admin/dashboard" className="hover:text-white">
            Admin
          </Link>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">Kontakt</h3>

        <div className="flex flex-col gap-2 text-gray-300">
          <p>Mëzez, Tiranë, Albania</p>

          <a href="tel:+355692902694" className="hover:text-white">
            +355 69 29 02 694
          </a>

          <a
            href="mailto:pjesekembimimiri@gmail.com"
            className="hover:text-white break-all"
          >
            pjesekembimimiri@gmail.com
          </a>

          <a
            href="https://www.instagram.com/pjese.kembimi.miri/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            Instagram
          </a>

          <a
            href="https://www.facebook.com/servis.miri.5/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            Facebook
          </a>

          <a
            href="https://www.tiktok.com/@pjesekembimimiri"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            TikTok
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-800 text-center text-gray-400 py-4 text-sm">
      © 2026 Pjesë Këmbimi Miri. All rights reserved.
    </div>
  </footer>
  );
}
export default Footer;
