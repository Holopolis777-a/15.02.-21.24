import React from 'react';

const Impressum = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Impressum</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Angaben gemäß § 5 TMG</h2>
          <p className="text-gray-700">
            VILONDA GmbH<br />
            Neue Mainzer Straße 6-10<br />
            60311 Frankfurt
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Vertretungsberechtigt</h2>
          <p className="text-gray-700">
            Viktor Ledin<br />
            Amtsgericht Frankfurt am Main<br />
            HRB Nr: 128535
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Kontakt</h2>
          <p className="text-gray-700">
            Telefon: <a href="tel:+4969247433870" className="text-blue-600 hover:text-blue-800">+49 69 2474 338 70</a><br />
            E-Mail: <a href="mailto:info@vilonda.de" className="text-blue-600 hover:text-blue-800">info@vilonda.de</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Umsatzsteuer-ID</h2>
          <p className="text-gray-700">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE356689703
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Redaktionell verantwortlich</h2>
          <p className="text-gray-700">
            Viktor Ledin<br />
            Neue Mainzer Straße 6-10<br />
            60311 Frankfurt
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">EU-Streitschlichtung</h2>
          <p className="text-gray-700">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a 
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            <br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Impressum;