import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContactSectionProps {
  icon: LucideIcon;
  title: string;
  content: string[];
}

const ContactSection: React.FC<ContactSectionProps> = ({ icon: Icon, title, content }) => {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-1 text-gray-700">
        {content.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </section>
  );
}

export default ContactSection;