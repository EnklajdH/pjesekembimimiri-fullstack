import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [registered, setRegistered] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Plotëso emrin, email dhe password.");
    }

    if (form.password.length < 6) {
      return alert("Password duhet të ketë minimumi 6 karaktere.");
    }

    try {
      await register(form);
      setRegistered(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Regjistrimi dështoi. Kontrollo të dhënat.";

      alert(message);
    }
  }

  if (registered) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="bg-white rounded-2xl shadow p-6 sm:p-8 text-center">
          <MailCheck className="mx-auto text-green-600 mb-5" size={65} />

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Llogaria u krijua
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Kontrollo email-in tënd për të verifikuar llogarinë. Në test lokal,
            linku i verifikimit gjendet te Laravel log.
          </p>

          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 break-all">
            Email-i i verifikimit u dërgua te:
            <br />
            <strong>{form.email}</strong>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700"
          >
            Vazhdo te profili
          </button>

          <Link to="/login" className="block mt-4 text-red-600 font-bold">
            Shko te Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
        <div className="text-center mb-6">
          <p className="text-red-600 font-bold mb-2">
            Pjesë Këmbimi Miri
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            Krijo llogari
          </h1>

          <p className="text-gray-600 mt-3">
            Regjistrohu për të ruajtur porositë dhe të dhënat e tua.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4" autoComplete="off">
          <input
            name="name"
            placeholder="Emri"
            autoComplete="off"
            className="w-full border px-4 py-3 rounded-lg"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="register_email"
            type="email"
            placeholder="Email"
            autoComplete="off"
            className="w-full border px-4 py-3 rounded-lg"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />

          <input
            name="phone"
            placeholder="Telefon"
            autoComplete="off"
            className="w-full border px-4 py-3 rounded-lg"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Adresa"
            autoComplete="off"
            className="w-full border px-4 py-3 rounded-lg"
            value={form.address}
            onChange={handleChange}
          />

          <input
            name="register_password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full border px-4 py-3 rounded-lg"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />

          <button
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Ke llogari?{" "}
          <Link to="/login" className="text-red-600 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

