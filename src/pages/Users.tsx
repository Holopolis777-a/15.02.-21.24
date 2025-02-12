import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import AdminGuard from '../components/auth/AdminGuard';
import UserList from './users/components/UserList';

const Users = () => {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UsersIcon className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Benutzerverwaltung</h1>
          </div>
        </div>
        <UserList />
      </div>
    </AdminGuard>
  );
};

export default Users;
