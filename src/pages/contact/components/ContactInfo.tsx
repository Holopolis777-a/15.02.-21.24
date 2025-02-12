import React from 'react';
import { Phone, Mail } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Phone className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Telefon</h2>
        </div>
        <a 
          href="tel:+4969247433870" 
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          +49 69 2474 338 70
        </a>
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">E-Mail</h2>
        </div>
        <a 
          href="mailto:info@vilonda.de"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          info@vilonda.de
        </a>
      </section>
    </div>
  );
};

export default ContactInfo;