import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { generateEmployerInviteLink } from '../../../lib/firebase/services/employerInviteService';

interface CompanyInviteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerId: string;
}

const CompanyInviteLinkModal: React.FC<CompanyInviteLinkModalProps> = ({ isOpen, onClose, brokerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const generateLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const invite = await generateEmployerInviteLink(brokerId, "");
      const registrationUrl = `${window.location.origin}/employer-registration?brokerId=${brokerId}&inviteId=${invite.id}`;
      setInviteLink(registrationUrl);
    } catch (error) {
      console.error('Error generating invite link:', error);
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
            Einladungslink generieren
          </Dialog.Title>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Generieren Sie einen Einladungslink, den Sie manuell an Unternehmen weitergeben können.
            </div>

            <button
              type="button"
              onClick={generateLink}
              disabled={loading}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Wird generiert...' : 'Link generieren'}
            </button>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {inviteLink && (
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CompanyInviteLinkModal;
