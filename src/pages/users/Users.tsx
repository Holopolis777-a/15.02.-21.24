import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AdminInviteButton from './components/AdminInviteButton';
import UserList from './components/UserList';

const Users = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UsersIcon className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Benutzerverwaltung</h1>
        </div>
        {isAdmin && <AdminInviteButton />}
      </div>
      
      <UserList />
    </div>
  );
};

export default Users;