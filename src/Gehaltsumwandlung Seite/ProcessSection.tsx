const steps = [
  { title: "Mitarbeiter einladen", description: "Laden Sie Ihre Mitarbeiter zur Gehaltsumwandlung ein" },
  { title: "Fahrzeug auswählen", description: "Wählen Sie aus unserer exklusiven Fahrzeugflotte" },
  { title: "Vertrag abschließen", description: "Einfache digitale Vertragsabwicklung" },
  { title: "Fahrzeug übernehmen", description: "Genießen Sie Ihr neues Fahrzeug" },
]

export function ProcessSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">So einfach geht's</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

