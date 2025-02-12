import React from 'react';
import { User } from '../../../types/auth';
import { User as UserIcon } from 'lucide-react';

interface ProfileHeaderProps {
  user: User | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-4 mb-8">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil bearbeiten</h1>
        <p className="text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
}

export default ProfileHeader;