import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound } from "lucide-react";

import api from "../api/axios";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!token || !email) {
      return alert("Linku i reset password nuk është i vlefshëm.");
    }

    if (!password || !passwordConfirmation) {
      return alert("Plotëso password-in dhe konfirmimin.");
    }

    if (password !== passwordConfirmation) {
      return alert("Password-at nuk përputhen.");
    }

    try {
      setLoading(true);

      await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      alert("Password-i u ndryshua me sukses. Tani mund të bësh login.");
      navigate("/login");
    } catch (error) {
      console.log("Reset password error:", error.response || error);

      const message =
        error.response?.data?.message ||
        "Password-i nuk u ndryshua. Linku mund të ketë skaduar.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl shadow p-8">
        <KeyRound className="mx-auto text-red-600 mb-4" size={50} />

        <h1 className="text-3xl font-bold mb-4 text-center">
          Ndrysho password-in
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Vendos password-in e ri për llogarinë tënde.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password i ri"
            className="w-full border px-4 py-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Konfirmo password-in"
            className="w-full border px-4 py-3 rounded-lg"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Duke ndryshuar..." : "Ndrysho password-in"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5">
          <Link to="/login" className="text-red-600 font-bold">
            Kthehu te Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;