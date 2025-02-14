import React from 'react';
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

  return (user?.logoUrl && user.logoUrl.trim() !== '' && (user.logoUrl.startsWith('http://') || user.logoUrl.startsWith('https://'))) ? (
    <img
      src={user.logoUrl}
      alt="Profile"
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  ) : (
    <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-200 bg-gray-50`} />
  );
};

export default UserAvatar;
