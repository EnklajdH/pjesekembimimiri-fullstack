import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Phone,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { count } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-xl sm:text-2xl font-bold leading-tight"
          >
            Pjesë Këmbimi{" "}
            <span className="text-red-600">Miri</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="hover:text-red-500">
              Home
            </Link>

            <Link to="/products" className="hover:text-red-500">
              Pjesë
            </Link>

            <Link to="/contact" className="hover:text-red-500">
              Kontakt
            </Link>

            {currentUser && !isAdmin && (
              <Link to="/orders" className="hover:text-red-500">
                Porositë
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin/dashboard" className="hover:text-red-500">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="https://wa.me/355692902694"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              <Phone size={17} />
              WhatsApp
            </a>

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="relative flex items-center"
            >
              <ShoppingCart size={25} />

              <span className="absolute -top-2 -right-2 bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            </Link>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/profile"}
                  className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700 max-w-[170px]"
                >
                  <User size={17} />
                  <span className="truncate">{currentUser.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-gray-800 p-2 rounded-lg hover:bg-gray-700"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="bg-gray-900 px-4 py-3 rounded-lg hover:bg-gray-800"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="bg-gray-900 px-4 py-3 rounded-lg hover:bg-gray-800"
              >
                Pjesë
              </Link>

              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="bg-gray-900 px-4 py-3 rounded-lg hover:bg-gray-800"
              >
                Kontakt
              </Link>

              {currentUser && !isAdmin && (
                <Link
                  to="/orders"
                  onClick={closeMobileMenu}
                  className="bg-gray-900 px-4 py-3 rounded-lg hover:bg-gray-800"
                >
                  Porositë
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={closeMobileMenu}
                  className="bg-gray-900 px-4 py-3 rounded-lg hover:bg-gray-800"
                >
                  Admin Dashboard
                </Link>
              )}

              <a
                href="https://wa.me/355692902694"
                target="_blank"
                rel="noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 bg-green-600 px-4 py-3 rounded-lg font-bold hover:bg-green-700"
              >
                <Phone size={18} />
                WhatsApp
              </a>

              {currentUser ? (
                <>
                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/profile"}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-2 bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700"
                  >
                    <User size={18} />
                    {currentUser.name}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-red-600 px-4 py-3 rounded-lg font-bold hover:bg-red-700"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="bg-gray-800 text-center px-4 py-3 rounded-lg hover:bg-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="bg-red-600 text-center px-4 py-3 rounded-lg font-bold hover:bg-red-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;

