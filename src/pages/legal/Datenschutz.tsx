import React from 'react';
import LegalLayout from './LegalLayout';

const Datenschutz = () => {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
          <h3 className="text-lg font-medium mb-2">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie der nachfolgenden, ausführlichen Datenschutzerklärung.
          </p>
        </section>

        {/* Rest of the privacy policy content */}
        {/* ... */}

        <div className="text-sm text-gray-500 mt-8 pt-8 border-t">
          Stand: Januar 2025
        </div>
      </div>
    </LegalLayout>
  );
};

export default Datenschutz;