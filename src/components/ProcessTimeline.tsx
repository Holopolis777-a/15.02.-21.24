import React, { useState } from 'react';
import { Mail, Car, FileText, CheckCircle, Bell, Truck } from 'lucide-react';

const steps = [
  {
    title: 'Mitarbeiter einladen',
    description: 'Laden Sie Ihre Mitarbeiter zum Gehaltsumwandlungsportal per Email oder Registrierungslink ein.',
    icon: Mail,
    details: 'Bei Registrierungslink müssen Sie diesen freigeben.'
  },
  {
    title: 'Fahrzeugauswahl',
    description: 'Ihre Mitarbeiter suchen sich Ihr Wunschfahrzeug aus und berechnen Ihren Vorteil.',
    icon: Car,
    details: 'Große Auswahl an E-Fahrzeugen verfügbar.'
  },
  {
    title: 'Anfrage erhalten',
    description: 'Ihr Mitarbeiter schickt Ihnen eine Gehaltsumwandlungsanfrage.',
    icon: FileText,
    details: 'Sie sehen alle Kosten, Informationen und Daten.'
  },
  {
    title: 'Genehmigung',
    description: 'Sie genehmigen die Anfrage.',
    icon: CheckCircle,
    details: 'Einfache Überprüfung und Freigabe.'
  },
  {
    title: 'Status-Updates',
    description: 'Sie werden über jeden Status über Anfrage, Lieferung und mehr informiert.',
    icon: Bell,
    details: 'Transparenter Prozess mit regelmäßigen Updates.'
  },
  {
    title: 'Kostenlose Lieferung',
    description: 'Das Fahrzeug wird KOSTENLOS zu Ihrer Firma oder Ihrem Wunschstandort geliefert.',
    icon: Truck,
    details: 'Inklusive Einweisung vor Ort.'
  }
];

export const ProcessTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">So einfach geht's</h2>
        <p className="text-gray-600">Der Weg zum E-Firmenwagen in nur wenigen Schritten</p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-emerald-100 rounded-full"></div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            return (
              <div
                key={index}
                className={`relative flex items-center gap-8 cursor-pointer transition-all duration-300 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                onClick={() => setActiveStep(index)}
              >
                {/* Line Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div
                    className={`w-6 h-6 rounded-full border-4 transition-colors duration-300 ${
                      isActive
                        ? 'border-emerald-500 bg-white'
                        : index < activeStep
                        ? 'border-emerald-300 bg-emerald-100'
                        : 'border-gray-300 bg-white'
                    }`}
                  ></div>
                </div>

                {/* Content */}
                <div
                  className={`w-5/12 group ${
                    isActive ? 'scale-105 -translate-y-1' : ''
                  } transition-all duration-300`}
                >
                  <div
                    className={`bg-white rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
                      isActive
                        ? 'border-emerald-200 shadow-emerald-100'
                        : 'border-gray-100 group-hover:border-emerald-100'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl transition-colors duration-300 ${
                          isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <p className="text-sm text-gray-500">{step.details}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessTimeline;
