import { Link } from 'react-router-dom';
function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2"><h2 className="text-2xl font-bold mb-3">Pjesë Këmbimi <span className="text-red-600">Miri</span></h2><p className="text-gray-300 max-w-xl">Gjithmonë pjesë këmbimi origjinale të përdorura nga Gjermania. Specializuar në Mercedes-Benz C-Class, E-Class, ML dhe GLK.</p></div>
        <div><h3 className="font-bold mb-3">Menu</h3><div className="flex flex-col gap-2 text-gray-300"><Link to="/">Home</Link><Link to="/products">Pjesë</Link><Link to="/contact">Kontakt</Link><Link to="/admin/dashboard">Admin</Link></div></div>
        <div><h3 className="font-bold mb-3">Kontakt</h3><p className="text-gray-300">Mëzez, Tiranë, Albania</p><p className="text-gray-300">+355 69 000 0000</p><p className="text-gray-300">info@pjesekembimimiri.al</p></div>
      </div>
      <div className="border-t border-gray-800 text-center text-gray-400 py-4 text-sm">© 2026 Pjesë Këmbimi Miri. All rights reserved.</div>
    </footer>
  );
}
export default Footer;
