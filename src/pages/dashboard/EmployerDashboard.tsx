import React, { useState } from 'react';
import { Users, Car, AlertCircle, Calendar, X, Mail, Link, ChevronLeft, ChevronRight, Check, X as XIcon, Building2, Wallet, Sparkles } from 'lucide-react';
import PendingApprovals from '../employees/components/PendingApprovals';
import EmployerOrderTimelineCard from '../../components/dashboard/EmployerOrderTimelineCard';
import { useEmployeeInvites } from '../../hooks/useEmployeeInvites';
import { useVehicleRequests } from '../../hooks/useVehicleRequests';
import { useAuthStore } from '../../store/authStore';
import { useSalaryRequests } from '../../hooks/useSalaryRequests';
import type { VehicleRequestWithCompany } from '../../types/vehicleRequest';
import type { EmployeeInvite } from '../../hooks/useEmployeeInvites';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useCompanyEmployees } from '../../hooks/useCompanyEmployees';
import EmployeeInviteModal from '../employees/components/EmployeeInviteModal';
import { useNews } from '../../hooks/useNews';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import CompanyLogo from '../../components/company/CompanyLogo';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  externalUrl?: string;
  publishedAt: string;
}

interface NewsResponse {
  news: NewsPost[];
  isLoading: boolean;
  error: string | null;
}

const NewsFeedSection = () => {
  const newsData = useNews() as NewsResponse;
  const { news, isLoading, error } = newsData;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6">
        <div className="flex items-center space-x-3 text-red-500 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
            <Sparkles className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Keine Neuigkeiten verfügbar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((post: NewsPost) => (
        <div 
          key={post.id} 
          className="bg-white dark:bg-gray-800/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {post.title}
                </h3>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(post.publishedAt), 'dd. MMMM yyyy', { locale: de })}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{post.content}</p>
            {post.imageUrl && (
              <div className="mt-4 relative rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-[1.02]">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            {post.externalUrl && (
              <a 
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                Mehr erfahren
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const PortalTypeInfo = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
            Mitarbeiter Portal
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Standard Mitarbeiter Zugang mit Basis-Funktionen für Ihr Team
          </p>
        </div>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
            Gehaltsumwandlungs Portal
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Erweiterter Zugang mit allen Funktionen zur Gehaltsumwandlung
          </p>
        </div>
      </div>
    </div>
  </div>
);

const EmployerDashboard = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email');
  const { user } = useAuthStore();
  const { invites, loading: invitesLoading } = useEmployeeInvites();
  const { employees, loading: employeesLoading } = useCompanyEmployees();
  const { requests } = useSalaryRequests();
  const pendingSalaryRequests = requests || [];
  
  const pendingInvites = (invites || []).filter(invite => invite.status === 'pending') as EmployeeInvite[];

  const handleApprove = async (inviteId: string) => {
    try {
      await updateDoc(doc(db, 'employeeInvites', inviteId), {
        status: 'accepted',
        approvedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Genehmigung fehlgeschlagen:', error);
    }
  };

  const handleDeny = async (inviteId: string) => {
    try {
      await updateDoc(doc(db, 'employeeInvites', inviteId), {
        status: 'declined',
        deniedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Ablehnung fehlgeschlagen:', error);
    }
  };
  
  const stats = [
    {
      title: 'Mitarbeiter',
      value: employeesLoading ? '...' : employees.length.toString(),
      icon: Users,
      link: '/employees',
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Registrierte Mitarbeiter'
    },
    {
      title: 'Anträge',
      value: pendingSalaryRequests.length.toString(),
      icon: AlertCircle,
      link: '/requests',
      gradient: 'from-amber-500 to-orange-600',
      description: 'Ausstehende Anträge'
    }
  ];

  const tutorialSteps = [
    {
      title: 'Herzlich Willkommen',
      icon: Sparkles,
      content: 'Schaffen Sie für sich und Ihre Mitarbeitenden einen echten Vorteil!• Ob Firmenwagen, Benefit-Portal oder Gehaltsumwandlung – mit VILOCAR bieten Sie starke Lösungen für alle.• Bestellen Sie selbst ganz einfach Fahrzeuge für Ihr Unternehmen oder ermöglichen Sie Ihren Mitarbeitenden Zugriff auf exklusive Konditionen.'
    },
    {
      title: 'Mitarbeitende einladen',
      icon: Users,
      content: 'Entscheiden Sie, ob Sie Ihre Mitarbeitenden für das Benefit-Portal oder das Gehaltsumwandlungsportal einladen möchten.• Einladungen per E-Mail: Direkte Einladung mit vorkonfiguriertem Zugang• Registrierungslink: Generieren Sie einen individuellen Einladungslink• Automatische Benachrichtigungen bei neuen Registrierungen'
    },
    {
      title: 'Registrierung & Freigabe',
      icon: Check,
      content: 'Bei Link-Registrierung:• Prüfen Sie Anmeldungen unter "Offene Genehmigungen"• Ein-Klick-Freischaltung für Mitarbeiterzugänge• Automatische Weiterleitung an Mitarbeitende nach Freigabe• Personalisiertes Portal mit Firmenlogo• Zugang zu exklusiven Konditionen:• Benefit-Portal: Großkundenkonditionen für private Käufe• Gehaltsumwandlungsportal: All-inclusive-Rate mit VILOCAR-Absicherung'
    },
    {
      title: 'Fahrzeugbestellungen',
      icon: Car,
      content: 'Einfache Fahrzeugbestellung für Ihr Unternehmen:• Große Auswahl an Marken zu TOP-Konditionen• Ohne Verhandlungen – immer der beste Preis• Direktlieferung vor Ihre Tür• Digitaler Prozess:• Gehaltsumwandlungsanfragen einfach prüfen und freigeben• Alle Dokumente digital in der App verfügbar• Automatische Benachrichtigungen bei Lieferupdates'
    }
  ];

  const handleNext = () => currentStep < tutorialSteps.length - 1 && setCurrentStep(currentStep + 1);
  const handlePrev = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          {user?.firstName ? `Willkommen, ${user.firstName}` : 'Herzlich Willkommen bei VILOCAR'}
        </h1>
        <div className="flex-shrink-0">
          <CompanyLogo />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gehaltsumwandlung Button */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />
              <a href="/salary-conversion" className="relative block">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-800/30 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gehaltsumwandlung</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Jetzt Gehaltsumwandlung beantragen
                      </p>
                    </div>
                    <div className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                      Mehr erfahren
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </a>
            </div>
            {stats.map((stat: { title: string; value: string; icon: React.ElementType; link: string; gradient: string; description: string }) => (
              <div 
                key={stat.title}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                     style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                </div>
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.description}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{stat.title}</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                    </div>
                    <a
                      href={stat.link}
                      className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Details anzeigen
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Approvals Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Offene Genehmigungen
                </h2>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <PendingApprovals />
            </div>
          </div>

          {/* News Feed Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Neuigkeiten & Updates
                </h2>
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <NewsFeedSection />
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column on large screens */}
        <div className="space-y-6 lg:col-span-1">
          <EmployerOrderTimelineCard />

        </div>
      </div>

      {/* Tutorial Section - Full width below main content */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <div className="flex justify-end mb-2">
          <Button
            onClick={() => setShowTutorial(prev => !prev)}
            variant="primary"
            size="sm"
            className="text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-100"
          >
            {showTutorial ? (
              <>
                <X className="w-4 h-4 mr-1" />
                Tutorial ausblenden
              </>
            ) : (
              'Tutorial anzeigen'
            )}
          </Button>
        </div>
        
        {showTutorial && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-lg">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-lg shadow-lg">
                  {React.createElement(tutorialSteps[currentStep].icon, { className: "w-8 h-8 text-white" })}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {tutorialSteps[currentStep].title}
                  </h3>
                  <ul className="text-gray-700 space-y-3">
                    {tutorialSteps[currentStep].content.split('•').map((item, index) => (
                      item.trim() && (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="shrink-0 mt-1">
                            <Check className="w-4 h-4 text-green-600" />
                          </span>
                          <span className="leading-relaxed">{item.trim()}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={handlePrev}
                  variant="primary"
                  size="sm"
                  disabled={currentStep === 0}
                  className={currentStep === 0 ? 'opacity-50' : ''}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Zurück
                </Button>
                <Button
                  onClick={handleNext}
                  variant="primary"
                  size="sm"
                  disabled={currentStep === tutorialSteps.length - 1}
                  className={currentStep === tutorialSteps.length - 1 ? 'opacity-50' : ''}
                >
                  Weiter
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee Invite Modal */}
      <EmployeeInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        initialMethod={inviteMethod}
      />
    </div>
  );
};

export default EmployerDashboard;
