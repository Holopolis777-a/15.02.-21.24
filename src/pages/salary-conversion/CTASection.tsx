import { ArrowRight } from "lucide-react"

interface CTASectionProps {
  onInviteClick: () => void;
}

export function CTASection({ onInviteClick }: CTASectionProps) {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Starten Sie jetzt mit der Gehaltsumwandlung</h2>
        <p className="text-xl mb-8">Ermöglichen Sie Ihren Mitarbeitern den Zugang zu attraktiven Mobilitätslösungen</p>
        <button 
          onClick={onInviteClick}
          className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 flex items-center mx-auto"
        >
          Jetzt Mitarbeiter einladen
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </section>
  )
}
