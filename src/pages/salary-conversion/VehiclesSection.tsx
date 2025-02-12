import { useState } from 'react';
import { useSalaryVehicles } from '../../hooks/useSalaryVehicles';
import { Vehicle } from '../../types/vehicle';
import { Battery, Zap, Car as CarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFuelTypeColors } from '../../utils/fuelTypeColors';

export function VehiclesSection() {
  const { vehicles, isLoading } = useSalaryVehicles();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex + 3 < vehicles.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!vehicles.length) return null;

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-[600px]">
          <div className="relative z-10 pt-32 max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              Gehaltsumwandlung
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Maximieren Sie die Vorteile für Ihre Mitarbeiter mit unserer innovativen Gehaltsumwandlungslösung
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
              Jetzt Mitarbeiter einladen
            </button>
          </div>

          <div className="absolute right-0 top-0 w-3/5 h-full">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/vilocar1.firebasestorage.app/o/public%2FSeiten%2Fmyenergi-4SyUf9MvWjU-unsplash.jpg?alt=media&token=c9cacd37-7ab8-47bd-8588-4b491b224890"
              alt="Elektrofahrzeug"
              className="w-full h-full object-cover rounded-bl-[200px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent rounded-bl-[200px]"></div>
          </div>
        </div>

        {/* Vehicles Section */}
        <div className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Premium E-Fahrzeuge zur Auswahl</h2>
            <p className="mt-4 text-lg text-gray-600">
              Wählen Sie aus einer exklusiven Auswahl modernster Elektrofahrzeuge
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto px-8">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="w-[calc(33.333% - 1rem)] flex-shrink-0"
                  >
                    <div
                      className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl cursor-pointer group"
                      onClick={() => window.location.href = `/vehicles/${vehicle.id}/detail`}
                    >
                      <div className="relative h-48">
                        {vehicle.images?.[0] ? (
                          <img
                            src={vehicle.images[0]}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <CarIcon className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Premium
                        </div>
                        {vehicle.fuelType === 'Elektro' && vehicle.range && (
                          <div className="absolute bottom-4 left-4">
                            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-3 py-1.5">
                              <Battery className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">
                                {vehicle.range} km
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Reichweite</p>
                            <p className="font-semibold text-gray-800">{vehicle.range} km</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Leistung</p>
                            <p className="font-semibold text-gray-800">{vehicle.power} PS</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline">
                              <span className="text-sm text-gray-500 font-medium">ab</span>
                              <div className="text-xl font-bold text-gray-900 ml-2">
                                {(vehicle.salaryConversionPrice || 0).toLocaleString('de-DE')} €*
                              </div>
                              <span className="text-sm font-medium text-gray-500 ml-1">/Monat</span>
                            </div>
                            {vehicle.isAvailable && (
                              <div className="text-sm font-medium px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                                Verfügbar
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {vehicles.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 ${
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentIndex + 3 >= vehicles.length}
                  className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 ${
                    currentIndex + 3 >= vehicles.length ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
