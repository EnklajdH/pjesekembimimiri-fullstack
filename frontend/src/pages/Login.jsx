import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const user = await login(email, password);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login dështoi. Kontrollo email dhe password.";

      alert(message);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
        <div className="text-center mb-6">
          <p className="text-red-600 font-bold mb-2">
            Pjesë Këmbimi Miri
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            Login
          </h1>

          <p className="text-gray-600 mt-3">
            Hyr në llogari për të parë profilin dhe porositë e tua.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" autoComplete="off">
          <input
            type="text"
            name="fake_username"
            autoComplete="username"
            className="hidden"
          />

          <input
            type="password"
            name="fake_password"
            autoComplete="new-password"
            className="hidden"
          />

          <input
            type="email"
            name="login_email"
            placeholder="Email"
            autoComplete="off"
            className="w-full border px-4 py-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            name="login_password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full border px-4 py-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-red-600 font-bold hover:underline"
            >
              Ke harruar password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Duke u loguar..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Nuk ke llogari?{" "}
          <Link to="/register" className="text-red-600 font-bold">
            Regjistrohu
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

