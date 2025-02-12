import React from 'react';
import { User } from 'lucide-react';
import { User as UserType } from '../../../types/auth';

interface UserAvatarProps {
  user: UserType | null;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return user?.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt="Profile"
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  ) : (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center`}>
      <User className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} text-gray-400`} />
    </div>
  );
};

export default UserAvatar;