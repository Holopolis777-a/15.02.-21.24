import React, { useState } from 'react';
import { X, Copy, Mail, CheckCircle } from 'lucide-react';
import { useCurrentCompany } from '../hooks/useCurrentCompany';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from '../store/authStore';

export function SalaryInviteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { company } = useCurrentCompany();
  const { user } = useAuthStore();

  const generateInviteLink = async () => {
    setLoading(true);
    try {
      const inviteDoc = await addDoc(collection(db, 'employeeInvites'), {
        companyId: company?.id,
        employerCompanyId: company?.id,
        invitedBy: user?.id,
        status: 'pending',
        portalType: 'salary',
        method: 'link',
        createdAt: new Date(),
        type: 'employee_invite',
        inviteType: 'employee'
      });

      const link = `${window.location.origin}/register/employee/${inviteDoc.id}`;
      setInviteLink(link);
    } catch (error) {
      console.error('Error generating invite link:', error);
    }
    setLoading(false);
  };

  const sendEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'employeeInvites'), {
        email,
        companyId: company?.id,
        employerCompanyId: company?.id,
        invitedBy: user?.id,
        status: 'pending',
        portalType: 'salary',
        method: 'email',
        createdAt: new Date(),
        type: 'employee_invite',
        inviteType: 'employee'
      });

      setShowSuccess(true);
      setEmail('');
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending invite:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Mitarbeiter zum Gehaltsumwandlungsportal einladen</h2>

        <div className="space-y-6">
          {/* Einladungslink Generator */}
          <div>
            <h3 className="text-lg font-medium mb-3">Einladungslink generieren</h3>
            {inviteLink ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 p-2 border rounded bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={generateInviteLink}
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Link generieren
              </button>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Oder</span>
            </div>
          </div>

          {/* Email Einladung */}
          <form onSubmit={sendEmailInvite}>
            <h3 className="text-lg font-medium mb-3">Per E-Mail einladen</h3>
            <div className="flex gap-2">
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mitarbeiter@firma.de"
                  className="w-full p-3 border rounded text-lg"
                  required
                />
                {showSuccess ? (
                  <div className="w-full bg-green-600 text-white px-4 py-3 rounded font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Einladung erfolgreich verschickt!
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Jetzt Einladung verschicken
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
