import { Wallet, PiggyBank, Users, Car, Check } from "lucide-react"

const benefits = [
  {
    icon: Wallet,
    title: "Steuerliche Vorteile",
    items: ["Bis zu 40% Steuerersparnis", "Reduzierte Lohnnebenkosten", "Optimierte Gehaltsstruktur"],
  },
  {
    icon: PiggyBank,
    title: "Geringere Sozialabgaben",
    items: ["Weniger Sozialversicherungsbeiträge", "Reduzierte monatliche Belastung", "Mehr Netto vom Brutto"],
  },
  {
    icon: Users,
    title: "Mitarbeiterbindung",
    items: ["Attraktive Zusatzleistungen", "Moderne Mobilitätslösungen", "Höhere Mitarbeiterzufriedenheit"],
  },
  {
    icon: Car,
    title: "Nachhaltigkeit",
    items: ["Förderung von E-Mobilität", "Reduzierter CO2-Ausstoß", "Zukunftsorientierte Mobilität"],
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Ihre Vorteile auf einen Blick</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl">
              <benefit.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{benefit.title}</h3>
              <ul className="space-y-2">
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
