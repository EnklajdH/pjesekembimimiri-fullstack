import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const item = ({ isActive }) =>
    `block px-4 py-3 rounded-lg font-semibold transition text-center md:text-left ${
      isActive
        ? "bg-red-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
        <aside className="bg-white rounded-2xl shadow p-4 sm:p-5 h-fit md:sticky md:top-24">
          <div className="mb-5">
            <h2 className="text-2xl font-bold mb-1">Admin Panel</h2>

            <p className="text-sm text-gray-500 break-all">
              {currentUser?.email}
            </p>
          </div>

          <nav className="grid grid-cols-2 md:grid-cols-1 gap-2">
            <NavLink to="/admin/dashboard" className={item}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/products" className={item}>
              Pjesët
            </NavLink>

            <NavLink to="/admin/products/create" className={item}>
              Shto pjesë
            </NavLink>

            <NavLink to="/admin/categories" className={item}>
              Kategoritë
            </NavLink>

            <NavLink to="/admin/categories/create" className={item}>
              Shto kategori
            </NavLink>

            <NavLink to="/admin/orders" className={item}>
              Porositë
            </NavLink>

            <Link
              to="/"
              className="block px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 text-center md:text-left"
            >
              Shiko website
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center md:justify-start gap-2 px-4 py-3 rounded-lg font-bold bg-black text-white hover:bg-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        <section className="md:col-span-4 min-w-0">{children}</section>
      </div>
    </div>
  );
}

export default AdminLayout;

