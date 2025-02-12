import React from 'react';
import { Mail, Phone, Building, User } from 'lucide-react';
import ContactSection from './components/ContactSection';
import ContactInfo from './components/ContactInfo';

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Kontakt</h1>
      
      <div className="space-y-8">
        <ContactSection
          icon={Building}
          title="VILONDA GmbH"
          content={[
            'Neue Mainzer Straße 6-10',
            '60311 Frankfurt'
          ]}
        />

        <ContactSection
          icon={User}
          title="Vertretungsberechtigt"
          content={[
            'Viktor Ledin',
            'Amtsgericht Frankfurt am Main',
            'HRB Nr: 128535'
          ]}
        />

        <ContactInfo />
      </div>
    </div>
  );
};

export default Contact;