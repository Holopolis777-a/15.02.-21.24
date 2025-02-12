import { ArrowDown } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">Gehaltsumwandlung</h1>
          <p className="text-xl mb-8 text-gray-600">
            Maximieren Sie die Vorteile für Ihre Mitarbeiter mit unserer innovativen Gehaltsumwandlungslösung
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
            Jetzt Mitarbeiter einladen
          </button>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-3/5 h-full">
        <Image
          src="/images/tesla-model3.jpg"
          alt="Elektrofahrzeug"
          layout="fill"
          objectFit="cover"
          className="rounded-bl-[200px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent"></div>
      </div>
      <ArrowDown
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce"
        size={32}
      />
    </section>
  )
}

