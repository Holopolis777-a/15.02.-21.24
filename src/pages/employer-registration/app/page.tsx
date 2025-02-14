import RegistrationForm from "@/components/RegistrationForm"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2149052434.jpg-FUaOmYRmYFnV9XZ1kraIphNWNtdJYK.jpeg"
          alt="Winding mountain road"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60">
          <div className="container mx-auto h-full flex flex-col items-center justify-center px-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vilocar-logo-dark-Zq7x4qYJqGveXrY7z1MDfI3fO4dmUz.png"
              alt="VILOCAR Logo"
              className="h-16 md:h-20 mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Willkommen bei VILOCAR</h1>
            <p className="text-white/90 mt-2 text-center max-w-2xl">
              Mobilität neu gedacht - Registrieren Sie sich jetzt als Arbeitgeber und entdecken Sie die Zukunft des
              Leasings
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 -mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-primary mb-6">Arbeitgeber Registrierung</h2>
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  )
}

