import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, MailCheck, XCircle } from "lucide-react";

function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");

  const isSuccess = status === "success";

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="mx-auto text-green-600 mb-5" size={70} />

            <h1 className="text-3xl font-bold mb-4">
              Email-i u verifikua me sukses
            </h1>

            <p className="text-gray-600 mb-8">
              Llogaria jote tani është e konfirmuar. Mund të hysh në profil dhe
              të bësh porosi në WhatsApp.
            </p>

            <Link
              to="/login"
              className="inline-block bg-green-600 text-white px-7 py-3 rounded-lg font-bold hover:bg-green-700"
            >
              Shko te Login
            </Link>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-600 mb-5" size={70} />

            <h1 className="text-3xl font-bold mb-4">
              Verifikimi nuk u krye
            </h1>

            <p className="text-gray-600 mb-8">
              Linku mund të jetë i pavlefshëm ose i skaduar. Provo të kërkosh
              një email të ri verifikimi nga profili.
            </p>

            <Link
              to="/login"
              className="inline-block bg-black text-white px-7 py-3 rounded-lg font-bold hover:bg-gray-800"
            >
              Kthehu te Login
            </Link>
          </>
        )}

        <div className="mt-8 bg-gray-50 rounded-xl p-5">
          <MailCheck className="mx-auto text-red-600 mb-3" size={35} />
          <p className="text-sm text-gray-600">
            Pjesë Këmbimi Miri përdor verifikimin e email-it për sigurinë e
            llogarive të klientëve.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;