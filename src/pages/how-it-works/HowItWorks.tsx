import React from 'react';
import { 
  Car, 
  Settings, 
  Send, 
  Mail, 
  FileText, 
  Download, 
  Key, 
  LogIn,
  ChevronRight
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Fahrzeugauswahl',
      description: 'Entdecken Sie unser Premium-Portfolio und wählen Sie Ihr Wunschfahrzeug aus.',
      icon: Car
    },
    {
      title: 'Konfiguration',
      description: 'Passen Sie die Laufzeit und Ihr Kilometerpaket individuell an Ihre Bedürfnisse an.',
      icon: Settings
    },
    {
      title: 'Unverbindliche Anfrage',
      description: 'Stellen Sie eine unverbindliche Anfrage für Ihr ausgewähltes Fahrzeug – unkompliziert und ohne Verpflichtungen.',
      icon: Send
    },
    {
      title: 'Verifizierung',
      description: 'Erhalten Sie eine E-Mail, um Ihre E-Mail-Adresse und Handynummer zu bestätigen.',
      icon: Mail
    },
    {
      title: 'Angebot',
      description: 'Nach erfolgreicher Verifizierung senden wir Ihnen Ihr persönliches Angebot direkt per E-Mail.',
      icon: FileText
    },
    {
      title: 'App herunterladen',
      description: 'Laden Sie unsere App herunter, um den weiteren Prozess komfortabel abzuschließen.',
      icon: Download
    },
    {
      title: 'Passwort setzen',
      description: 'Klicken Sie in der App auf „Erster Login?" und setzen Sie Ihr persönliches Passwort.',
      icon: Key
    },
    {
      title: 'App-Login',
      description: 'Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem neuen Passwort in der App an.',
      icon: LogIn
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">So funktioniert der Bestellprozess</h1>
      <p className="text-xl text-gray-600 mb-8">
        Ihr Weg zum Wunschfahrzeug – einfach, transparent und digital.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[2.25rem] top-0 bottom-0 w-0.5 bg-blue-200"></div>

        {/* Timeline steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start">
              <div className="absolute left-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-20">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Bereit für Ihr neues Fahrzeug?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Starten Sie jetzt Ihre unverbindliche Anfrage und profitieren Sie von unseren attraktiven Konditionen.
        </p>
        <a 
          href="/vehicles/private" 
          className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Fahrzeuge entdecken
          <ChevronRight className="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default HowItWorks;
