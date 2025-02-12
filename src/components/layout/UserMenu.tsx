import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut,
  Camera,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { signOut } from '../../lib/auth';

const UserMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        {user?.logoUrl ? (
          <img
            src={user.logoUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {user?.logoUrl ? (
                  <img
                    src={user.logoUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md">
                  <Camera className="w-3 h-3 text-gray-500" />
                </button>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-3" />
                <span>Profil bearbeiten</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Abmelden</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
