import React from 'react';
import LegalLayout from './LegalLayout';

const Impressum = () => {
  return (
    <LegalLayout title="Impressum">
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
      </div>
    </LegalLayout>
  );
};

export default Impressum;