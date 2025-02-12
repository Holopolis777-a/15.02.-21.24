import React from 'react';
import { Users, Wallet } from 'lucide-react';
import { useEmployeeInvites } from '../../../hooks/useEmployeeInvites';
import { useAuthStore } from '../../../store/authStore';

const EmployeeInvitesList = () => {
  const { invites, loading, error } = useEmployeeInvites();
  const { user } = useAuthStore();

  console.log('[DEBUG] EmployeeInvitesList - User:', {
    id: user?.id,
    companyId: user?.companyId,
    email: user?.email
  });
  console.log('[DEBUG] EmployeeInvitesList - Invites:', invites);
  console.log('[DEBUG] EmployeeInvitesList - Loading:', loading);
  console.log('[DEBUG] EmployeeInvitesList - Error:', error);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support
          </p>
        </div>
      </div>
    );
  }

  const getPortalIcon = (portalType: 'normal' | 'salary') => {
    if (portalType === 'normal') {
      return (
        <div className="bg-blue-50 p-1.5 rounded">
          <Users className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    return (
      <div className="bg-pink-50 p-1.5 rounded">
        <Wallet className="w-4 h-4 text-pink-600" />
      </div>
    );
  };

  const getPortalName = (portalType: 'normal' | 'salary') => {
    return portalType === 'normal' ? 'Mitarbeiter Portal' : 'Gehaltsumwandlungs Portal';
  };

  const getInviteStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend';
      case 'accepted':
        return 'Angenommen';
      case 'declined':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Eingeladene Mitarbeiter</h2>
      <div className="space-y-2">
        <div className="grid grid-cols-[auto,1fr,auto,auto] gap-4 px-4 py-2 bg-gray-50 rounded-t-lg">
          <span className="text-sm font-medium text-gray-500">Portal</span>
          <span className="text-sm font-medium text-gray-500">Email</span>
          <span className="text-sm font-medium text-gray-500">Status</span>
          <span className="text-sm font-medium text-gray-500">Eingeladen am</span>
        </div>

        {!invites || invites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Noch keine Mitarbeiter eingeladen</p>
            <p className="text-sm text-gray-400 mt-2">
              Eingeladene Mitarbeiter werden hier angezeigt
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Debug: {invites ? 'Array is empty' : 'Array is undefined'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="grid grid-cols-[auto,1fr,auto,auto] gap-4 px-4 py-3 items-center"
              >
                <div className="flex items-center gap-2">
                  {getPortalIcon(invite.portalType)}
                </div>
                <div>
                  <div className="text-sm text-gray-900">{invite.email}</div>
                  <div className="text-xs text-gray-500">{getPortalName(invite.portalType)}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {getInviteStatus(invite.status)}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(invite.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Mitarbeiter Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-pink-50 p-1.5 rounded">
              <Wallet className="w-4 h-4 text-pink-600" />
            </div>
            <span className="text-sm text-gray-600">Gehaltsumwandlungs Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInvitesList;
