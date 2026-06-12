import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import api from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    if (!email) {
      return alert("Vendos email-in.");
    }

    try {
      setLoading(true);
      setSuccessMessage("");

      await api.post("/forgot-password", {
        email,
      });

      setSuccessMessage(
        "Nëse ky email ekziston në sistem, linku për ndryshimin e password-it u dërgua."
      );
    } catch (error) {
      console.log("Forgot password error:", error.response || error);

      const message =
        error.response?.data?.message ||
        "Nuk u dërgua linku. Kontrollo email-in.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl shadow p-8">
        <Mail className="mx-auto text-red-600 mb-4" size={50} />

        <h1 className="text-3xl font-bold mb-4 text-center">
          Ke harruar password?
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Vendos email-in e llogarisë dhe do të marrësh një link për të
          ndryshuar password-in.
        </p>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-5">
            {successMessage}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Duke dërguar..." : "Dërgo linkun"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5">
          T’u kujtua password-i?{" "}
          <Link to="/login" className="text-red-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;