import React from 'react';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children, title }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{title}</h1>
      <div className="prose prose-sm max-w-none text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default LegalLayout;