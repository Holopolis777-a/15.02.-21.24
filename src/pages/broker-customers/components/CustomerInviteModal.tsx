import React, { useState, useRef } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { createCustomerInvite, generateCustomerInviteLink } from '../../../lib/firebase/services/customerInviteService';
import { ClipboardIcon, CheckIcon, EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/classNames';
import { CustomerInvite } from '../../../types/customer';

interface CustomerInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerId: string;
}

const CustomerInviteModal: React.FC<CustomerInviteModalProps> = ({ isOpen, onClose, brokerId }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brokerId) {
      setError('Broker ID ist erforderlich');
      return;
    }

    setLoading(true);
    setError(null);
    setEmailSuccess(false);

    try {
      console.log('Creating customer invite:', { email, brokerId });
      await createCustomerInvite(email, brokerId);
      setEmailSuccess(true);
      setEmail('');
      setTimeout(() => {
        setEmailSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating customer invite:', error);
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Kunde einladen
          </Dialog.Title>

          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
              <Tab
                className={({ selected }) =>
                  cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  <span>Per E-Mail einladen</span>
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <LinkIcon className="h-5 w-5" />
                  <span>Link generieren</span>
                </div>
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="kunde@beispiel.de"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

                  {emailSuccess && (
                    <div className="text-green-500 text-sm mt-2">
                      Einladung wurde erfolgreich per E-Mail versendet!
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Wird gesendet...' : 'Einladung senden'}
                    </button>
                  </div>
                </form>
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Generieren Sie einen Einladungslink, den Sie manuell an Ihre Kunden weitergeben können.
                  </div>
                  
                  <button
                    type="button"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const invite = await generateCustomerInviteLink(brokerId);
                        const registrationUrl = `${window.location.origin}/register/customer?brokerId=${brokerId}&inviteId=${invite.id}`;
                        setInviteLink(registrationUrl);
                        setLinkSuccess(true);
                      } catch (error) {
                        console.error('Error generating invite link:', error);
                        setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Wird generiert...' : 'Link generieren'}
                  </button>

                  {linkSuccess && (
                    <div className="mt-4">
                      <div className="text-green-500 text-sm mb-2">
                        Einladungslink wurde erfolgreich generiert!
                      </div>
                      <div className="mt-2">
                        <label htmlFor="inviteLink" className="block text-sm font-medium text-gray-700">
                          Einladungslink
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            id="inviteLink"
                            ref={linkInputRef}
                            value={inviteLink}
                            readOnly
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 text-gray-900 sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (linkInputRef.current) {
                                linkInputRef.current.select();
                                document.execCommand('copy');
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }
                            }}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                          >
                            {copied ? (
                              <CheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <ClipboardIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Schließen
                    </button>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CustomerInviteModal;
