
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

function Contact() {
  const whatsappMessage = encodeURIComponent(
    "Pershendetje, dua informacion per pjese kembimi Mercedes-Benz."
  );

  return (
    <div>
      <section className="bg-black text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500 font-bold mb-3">
            Pjesë Këmbimi Miri
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Na kontaktoni
          </h1>

          <p className="text-gray-300 max-w-2xl text-base sm:text-lg leading-relaxed">
            Jemi në Mëzez, Tiranë. Mund të na kontaktoni për çdo pjesë
            Mercedes-Benz të përdorur origjinale nga Gjermania.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Informacion kontakti
          </h2>

          <div className="space-y-5">
            <div className="flex gap-4">
              <MapPin className="text-red-600 flex-shrink-0 mt-1" />

              <div>
                <h3 className="font-bold">Adresa</h3>
                <p className="text-gray-600">Mëzez, Tiranë, Albania</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-red-600 flex-shrink-0 mt-1" />

              <div>
                <h3 className="font-bold">WhatsApp / Telefon</h3>
                <p className="text-gray-600">+355 69 290 2694</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="text-red-600 flex-shrink-0 mt-1" />

              <div className="min-w-0">
                <h3 className="font-bold">Email</h3>
                <p className="text-gray-600 break-all">
                  pjesekembimimiri@gmail.com
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="text-red-600 flex-shrink-0 mt-1" />

              <div>
                <h3 className="font-bold">Orari</h3>
                <div className="text-gray-600">
                  <p>E Hënë - E Premte: 08:00 - 17:00</p>
                  <p>E shtunë: 08:00 - 14:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`https://wa.me/355692902694?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 text-white text-center py-4 rounded-lg font-bold hover:bg-green-700"
            >
              <MessageCircle size={20} />
              Shkruaj në WhatsApp
            </a>

            <a
              href="mailto:pjesekembimimiri@gmail.com"
              className="flex items-center justify-center bg-black text-white text-center py-4 rounded-lg font-bold hover:bg-gray-800"
            >
              Dërgo email
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden min-h-[360px] lg:min-h-full">
          <iframe
            title="Pjesë Këmbimi Miri Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11982.261503848344!2d19.743088781833663!3d41.34006339784675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031b3f486a0b9%3A0xc4f4d912c7b14e8d!2sPjese%20kembimi%20Miri%20Mercedes%20Benz!5e0!3m2!1sen!2s!4v1781282247059!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[360px] sm:h-[420px] lg:h-full min-h-[360px]"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
        <div className="bg-gray-100 rounded-2xl p-5 sm:p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Kërkon një pjesë specifike?
          </h2>

          <p className="text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            Na dërgo modelin e makinës, vitin, foton e pjesës ose kodin OEM në
            WhatsApp dhe do të të përgjigjemi sa më shpejt.
          </p>

          <a
            href={`https://wa.me/355692902694?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-green-600 text-white px-7 py-4 rounded-lg font-bold hover:bg-green-700"
          >
            <MessageCircle size={20} />
            Kontakto tani
          </a>
        </div>
      </section>
    </div>
  );
}

export default Contact;

