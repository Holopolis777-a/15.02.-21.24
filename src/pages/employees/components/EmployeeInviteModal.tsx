import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../../../store/authStore';
import { inviteEmployee } from '../../../lib/firebase/services/employeeInviteService';
import { useCurrentCompany } from '../../../hooks/useCurrentCompany';
import { Link } from 'lucide-react';

interface EmployeeInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMethod?: 'email' | 'link';
}

const EmployeeInviteModal: React.FC<EmployeeInviteModalProps> = ({ isOpen, onClose, initialMethod = 'email' }) => {
  const [email, setEmail] = useState('');
  const [portalType, setPortalType] = useState<'normal' | 'salary'>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [normalPortalLink, setNormalPortalLink] = useState<string>('');
  const [salaryPortalLink, setSalaryPortalLink] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<'normal' | 'salary' | null>(null);
  const [linksLoading, setLinksLoading] = useState(false);
  const { user } = useAuthStore();
  const { company, loading: companyLoading } = useCurrentCompany();

  // Clear states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNormalPortalLink('');
      setSalaryPortalLink('');
      setCopySuccess(null);
      setError(null);
      setEmail('');
      setPortalType('normal');
    } else {
      // If modal is opened with 'link' method, show the links section first
      if (initialMethod === 'link') {
        // Add a small delay to ensure the modal is fully rendered
        setTimeout(() => {
          document.getElementById('links-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [isOpen, initialMethod]);

  // Generate registration links using the invite service
  const generateRegistrationLink = async (type: 'normal' | 'salary') => {
    if (!company?.id || !user?.id) return '';
    try {
      setLinksLoading(true);
      const result = await inviteEmployee(
        '', // Empty email for link-based invites
        company.id,
        type,
        user.id
      );
      if (result.success) {
        const baseUrl = window.location.origin;
        return `${baseUrl}/verify/employee/${type}?company=${company.id}&invite=${result.inviteId}`;
      }
      return '';
    } catch (err) {
      console.error('Failed to generate link:', err);
      return '';
    } finally {
      setLinksLoading(false);
    }
  };

  // Generate links when modal opens
  useEffect(() => {
    if (isOpen && company?.id && user?.id) {
      setLinksLoading(true);
      Promise.all([
        generateRegistrationLink('normal'),
        generateRegistrationLink('salary')
      ]).then(([normalLink, salaryLink]) => {
        setNormalPortalLink(normalLink);
        setSalaryPortalLink(salaryLink);
        setLinksLoading(false);
      });
    }
  }, [isOpen, company?.id, user?.id]);


  const handleCopyLink = async (type: 'normal' | 'salary') => {
    const linkToCopy = type === 'normal' ? normalPortalLink : salaryPortalLink;
    if (linkToCopy) {
      try {
        await navigator.clipboard.writeText(linkToCopy);
        setCopySuccess(type);
        setTimeout(() => setCopySuccess(null), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };
  
  if (!isOpen) return null;

  // Show loading state while company data is being fetched
  if (companyLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <p className="text-center">Laden...</p>
        </div>
      </div>
    );
  }
  
  // Show error if no company is assigned
  if (!company?.id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <p className="text-center text-red-500">Keine Firma zugeordnet. Bitte kontaktieren Sie den Support.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!company?.id || !user?.id) {
        throw new Error('Keine Firma zugeordnet oder Benutzer nicht eingeloggt');
      }

      await inviteEmployee(email, company.id, portalType, user.id);
      setSuccessMessage('Mitarbeiter wurde erfolgreich eingeladen');
      // Clear form
      setEmail('');
      setPortalType('normal');
      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4 border border-gray-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mitarbeiter einladen</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Modal schließen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Link Section */}
        <section id="links-section" className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Einladungslinks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linksLoading && (
                  <div className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Generiere Link...</span>
                  </div>
                )}
            {/* Normal Portal Card */}
            <div className="relative group border border-gray-200 rounded-xl p-5 hover:border-blue-100 transition-all duration-200 bg-gradient-to-br from-blue-50/20 to-white shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100/20 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mitarbeiter Portal</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Standard-Zugang für Mitarbeiter</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyLink('normal')}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Link kopieren"
                >
                {linksLoading && (
                  <div className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Generiere Link...</span>
                  </div>
                )}
              {copySuccess === 'normal' ? (
                <div className="flex items-center gap-1 text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Kopiert</span>
                </div>
              ) : (
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
                </button>
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono text-gray-600 truncate p-2 bg-gray-50 rounded-md">
                  {normalPortalLink || 'https://portal.example.com/invite/...'}
                </div>
              </div>
            </div>

            {/* Salary Portal Card */}
            <div className="relative group border border-gray-200 rounded-xl p-5 hover:border-purple-100 transition-all duration-200 bg-gradient-to-br from-purple-50/20 to-white shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100/20 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gehaltsumwandlung</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Für Fahrzeugleasing & Co.</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyLink('salary')}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Link kopieren"
                >
                  {copySuccess === 'salary' ? (
                    <div className="flex items-center gap-1.5 text-green-600 animate-pulse">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">Kopiert!</span>
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5 text-purple-500 hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
              <div className="mt-2">
                <div className="text-sm font-mono text-gray-600 truncate p-2 bg-gray-50 rounded-md">
                  {salaryPortalLink || 'https://gehaltsumwandlung.example.com/invite/...'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm text-gray-500 font-medium">oder per E-Mail einladen</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portal Typ
            </label>
            <select
              value={portalType}
              onChange={(e) => setPortalType(e.target.value as 'normal' | 'salary')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="normal">Mitarbeiter Portal</option>
              <option value="salary">Gehaltsumwandlungs Portal</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 text-green-500 text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading || !!successMessage}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Wird eingeladen...' : 'Einladen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root') || document.body);
};

export default EmployeeInviteModal;
