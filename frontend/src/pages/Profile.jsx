import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailCheck, MailWarning } from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, refreshUser } = useAuth();

  const [sendingVerification, setSendingVerification] = useState(false);
  const [message, setMessage] = useState("");

  const isVerified = Boolean(currentUser?.email_verified_at);

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function resendVerificationEmail() {
    try {
      setSendingVerification(true);
      setMessage("");

      await api.post("/email/verification-notification");

      setMessage(
        "Email-i i verifikimit u dërgua përsëri. Kontrollo inbox ose Laravel log."
      );

      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      console.log("Resend verification error:", error.response || error);

      const errorMessage =
        error.response?.data?.message ||
        "Email-i i verifikimit nuk u dërgua.";

      alert(errorMessage);
    } finally {
      setSendingVerification(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8">
        <div className="mb-6">
          <p className="text-red-600 font-bold mb-2">
            Pjesë Këmbimi Miri
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold">
            Profili im
          </h1>

          <p className="text-gray-600 mt-3">
            Menaxho llogarinë, statusin e email-it dhe porositë e tua.
          </p>
        </div>

        {!isVerified ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-4 sm:p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <MailWarning
                className="text-yellow-600 flex-shrink-0 mt-1"
                size={28}
              />

              <div className="w-full">
                <h2 className="font-bold text-lg">
                  Email-i nuk është verifikuar
                </h2>

                <p className="text-sm mt-1 leading-relaxed">
                  Verifiko email-in për siguri më të lartë të llogarisë. Në test
                  lokal, linku shfaqet te Laravel log.
                </p>

                <button
                  onClick={resendVerificationEmail}
                  disabled={sendingVerification}
                  className="mt-4 w-full sm:w-auto bg-yellow-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-yellow-700 disabled:opacity-60"
                >
                  {sendingVerification
                    ? "Duke dërguar..."
                    : "Ridërgo email verifikimi"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 sm:p-5 mb-6">
            <div className="flex items-start sm:items-center gap-3">
              <MailCheck
                className="text-green-600 flex-shrink-0 mt-1 sm:mt-0"
                size={28}
              />

              <div>
                <h2 className="font-bold text-lg">Email-i është verifikuar</h2>
                <p className="text-sm mt-1">
                  Llogaria jote është e konfirmuar.
                </p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
          <div className="bg-gray-100 rounded-xl p-5">
            <p className="text-gray-500">Emri</p>
            <h2 className="text-lg sm:text-xl font-bold break-words">
              {currentUser?.name}
            </h2>
          </div>

          <div className="bg-gray-100 rounded-xl p-5">
            <p className="text-gray-500">Email</p>
            <h2 className="text-lg sm:text-xl font-bold break-all">
              {currentUser?.email}
            </h2>
          </div>

          <div className="bg-gray-100 rounded-xl p-5">
            <p className="text-gray-500">Roli</p>
            <h2 className="text-lg sm:text-xl font-bold">
              {currentUser?.role}
            </h2>
          </div>

          <div className="bg-gray-100 rounded-xl p-5">
            <p className="text-gray-500">Statusi i email-it</p>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isVerified ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isVerified ? "I verifikuar" : "I paverifikuar"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/orders"
            className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 text-center"
          >
            Historiku i porosive
          </Link>

          <Link
            to="/products"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 text-center"
          >
            Shiko pjesët
          </Link>

          <button
            onClick={handleLogout}
            className="bg-gray-200 text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-300"
          >
            Dil nga llogaria
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

