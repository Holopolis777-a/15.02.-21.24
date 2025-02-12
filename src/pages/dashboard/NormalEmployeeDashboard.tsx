import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useVehicles } from '../../hooks/useVehicles';
import { useCurrentCompany } from '../../hooks/useCurrentCompany';
import { useNews } from '../../hooks/useNews';
import { useVehicleRequests } from '../../hooks/useVehicleRequests';
import VehicleRequestList from '../../pages/requests/components/VehicleRequestList';
import OrderTimelineCard from '../../components/dashboard/OrderTimelineCard';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Vehicle } from '../../types/vehicle';
import { getLowestMonthlyRate } from '../../utils/priceUtils';

const NormalEmployeeDashboard = () => {
  const { user } = useAuthStore();
  const { vehicles, isLoading } = useVehicles();
  const { company } = useCurrentCompany();
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const { requests, loading, error } = useVehicleRequests();

    // Filter out salary vehicles
    const privateVehicles = vehicles.filter(v => !v.categories?.includes('salary'));

    const nextVehicle = () => {
      setCurrentVehicleIndex((prev) => 
        prev === privateVehicles.length - 1 ? 0 : prev + 1
      );
    };

    const previousVehicle = () => {
      setCurrentVehicleIndex((prev) => 
        prev === 0 ? privateVehicles.length - 1 : prev - 1
      );
    };

    return (
      <div className="p-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section with Company Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {company?.logoUrl && (
                <div className="w-12 h-12 bg-white rounded-full shadow-md p-2 flex items-center justify-center">
                  <img 
                    src={company.logoUrl} 
                    alt={`${company.name} Logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-800">Willkommen bei VILOCAR</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                <span className="text-sm font-medium text-gray-600">Privatfahrzeuge verfügbar: {privateVehicles.length}</span>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Vehicle Section */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex gap-2">
                    <button onClick={previousVehicle} className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <button onClick={nextVehicle} className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {!isLoading && privateVehicles[currentVehicleIndex] && (
                  <div className="relative" onClick={() => window.location.href = `/vehicles/detail/${privateVehicles[currentVehicleIndex].id}`}>
                    {privateVehicles[currentVehicleIndex].promotionText && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full z-10 shadow-md">
                        {privateVehicles[currentVehicleIndex].promotionText}
                      </div>
                    )}
                    <div className="aspect-[16/9] relative">
                      {privateVehicles[currentVehicleIndex].images?.[0] ? (
                        <img 
                          src={privateVehicles[currentVehicleIndex].images[0]}
                          alt={`${privateVehicles[currentVehicleIndex].brand} ${privateVehicles[currentVehicleIndex].model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <div className="text-white">
                          <h2 className="text-2xl font-bold mb-1">
                            {privateVehicles[currentVehicleIndex].brand} {privateVehicles[currentVehicleIndex].model}
                          </h2>
                          <div className="flex gap-3 items-center">
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                              </svg>
                              <span>Elektro</span>
                            </div>
                            {privateVehicles[currentVehicleIndex].power && (
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2v20M2 12h20"/>
                                </svg>
                                <span>{privateVehicles[currentVehicleIndex].power} PS</span>
                              </div>
                            )}
                            {privateVehicles[currentVehicleIndex].transmission && (
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"/>
                                  <path d="M12 6v6l4 2"/>
                                </svg>
                                <span>{privateVehicles[currentVehicleIndex].transmission}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {privateVehicles[currentVehicleIndex].deliveryTime && (
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium inline-block mb-3">
                          Lieferzeit: {privateVehicles[currentVehicleIndex].deliveryTime} Monate
                        </div>
                      )}
                      
                      {privateVehicles[currentVehicleIndex].priceMatrix && (
                        <div className="mb-3">
                          <div className="text-xl font-bold text-teal-500">
                            Monatlich ab {getLowestMonthlyRate(privateVehicles[currentVehicleIndex].priceMatrix).toLocaleString('de-DE')},-€
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Inkl. Full-Service, Wartung und Verschleiß, Versicherung u.v.m...
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/vehicles/${privateVehicles[currentVehicleIndex].id}/detail`;
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white hover:bg-teal-600 transition-colors py-2 px-3 rounded-lg font-medium text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Fahrzeug anzeigen
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* News Feed Section */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Neuigkeiten</h2>
                <NewsFeed />
        </div>

        {/* Requests Section */}
        <div className="mt-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Deine Anfragen</h2>
                  <VehicleRequestList requests={requests} loading={loading} error={error} />
                </div>
              </div>
            </div>

            {/* Right Column - Process Overview */}
            <div className="col-span-12 lg:col-span-4">
              <OrderTimelineCard />
              {/* New Process Section */}
              <div className="bg-white rounded-xl p-6 shadow-md my-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">In wenigen Schritten erklärt</h2>
                <div className="space-y-6">
                  {[
                    { icon: '🚗', title: 'Schritt 1', subtitle: 'Fahrzeug auswählen', text: 'Stöbern Sie durch unsere große Fahrzeugauswahl' },
                    { icon: '📩', title: 'Schritt 2', subtitle: 'Anfrage stellen', text: 'Senden Sie eine Anfrage für ein individuelles Angebot' },
                    { icon: '📱', title: 'Schritt 3', subtitle: 'Digitaler Vertragsabschluss', text: 'Unterzeichnen Sie das Angebot komplett digital in der DRIVER App' },
                    { icon: '🚚', title: 'Schritt 4', subtitle: 'Fahrzeugstatus verfolgen', text: 'Verfolgen Sie den gesamten Prozess bis zur Lieferung in der App' },
                    { icon: '🏡', title: 'Schritt 5', subtitle: 'Fahrzeuglieferung & Übersicht behalten', text: 'Lieferung vor Ihre Haustür und digitale Übersicht aller Fahrzeugdaten' }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-teal-100 text-teal-500 w-10 h-10 rounded-xl flex items-center justify-center text-xl">
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{step.title}</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{step.subtitle}</h3>
                        <p className="text-gray-600 text-sm">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Section */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Deine Vorteile</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: '🌟', title: 'Exklusive Sonderkonditionen', text: 'Sonderpreise nur für Unternehmensmitarbeiter' },
                    { icon: '🚗', title: 'Große Fahrzeugauswahl', text: 'Viele Hersteller und Modelle zu TOP-Konditionen verfügbar' },
                    { icon: '📱', title: 'Digitaler Prozess', text: 'Komplett online - von der Anfrage bis zur Lieferung' },
                    { icon: '🛠️', title: 'Full Service Leasing', text: 'Inklusive Wartung, Versicherung und Pannenhilfe' }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="bg-teal-100 text-teal-500 w-8 h-8 rounded-lg flex items-center justify-center text-lg">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm">{benefit.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const NewsFeed = () => {
    const { news, isLoading, error } = useNews();

    if (isLoading) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (news.length === 0) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-gray-500">Keine Neuigkeiten verfügbar</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md divide-y">
        {news.map((post) => (
          <div key={post.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
                <p className="mt-1 text-gray-600">{post.content}</p>
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="mt-3 rounded-lg max-h-40 object-cover" 
                  />
                )}
                {post.externalUrl && (
                  <a 
                    href={post.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-blue-600 hover:text-blue-800"
                  >
                    Mehr erfahren →
                  </a>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(post.publishedAt), 'dd. MMMM yyyy', { locale: de })}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

export default NormalEmployeeDashboard;
