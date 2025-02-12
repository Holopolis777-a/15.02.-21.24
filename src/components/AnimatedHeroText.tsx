import React from 'react';

export const AnimatedHeroText: React.FC = () => {
  return (
    <div className="relative">
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl -ml-48 -mb-48"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto py-16">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Machen Sie E-Mobilität für Ihre Mitarbeiter{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-emerald-600 animate-pulse">bezahlbar</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/20 to-blue-200/20 blur rounded-lg transform -rotate-1"></div>
          </span>
        </h1>
        <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
          Bieten Sie Ihrem Team mit Vilonda eine zukunftsweisende und kostengünstige Mobilitätslösung an. 
          Dank flexibler Leasingangebote und umfassender Services wird der Umstieg auf Elektrofahrzeuge so einfach wie nie. 
          Profitieren Sie von steuerlichen Vorteilen, steigern Sie Ihr Arbeitgeberimage und leisten Sie gemeinsam mit 
          Ihren Mitarbeitern einen aktiven Beitrag zum Klimaschutz.
        </p>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeroText;
