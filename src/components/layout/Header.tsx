import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAdminLogo } from '../../hooks/useAdminLogo';
import { signOut } from '../../lib/auth';
import { UserDropdown } from './header/UserDropdown';
import DataCompletionModal from '../DataCompletionModal';
import { ChevronDown } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const logoUrl = useAdminLogo();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isVehicleMenuOpen, setIsVehicleMenuOpen] = useState(false);
  const vehicleMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const [lastScrollTime, setLastScrollTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setLastScrollTime(Date.now());
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Prüfen, ob der Klick innerhalb des Dropdowns oder Buttons erfolgte
      const isDropdownClick = event.target instanceof Node && (
        userDropdownRef.current?.contains(event.target) ||
        userMenuRef.current?.contains(event.target)
      );

      if (vehicleMenuRef.current && !vehicleMenuRef.current.contains(event.target as Node)) {
        setIsVehicleMenuOpen(false);
      }
      
      // Schließe das User-Menü nur, wenn außerhalb geklickt wurde
      if (!isDropdownClick) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsVehicleMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile');
  };

  const handleCompanyDataClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile/company');
  };

  const getVehicleMenuItems = () => {
    const items = [
      {
        label: 'Privatwagen',
        path: '/vehicles/private',
        roles: ['admin', 'employee_normal', 'employee_salary', 'customer']
      },
      {
        label: 'Firmenwagen',
        path: '/vehicles/company',
        roles: ['admin', 'employer', 'broker']
      },
      {
        label: 'Gehaltsumwandlung',
        path: '/vehicles/salary',
        roles: ['admin', 'employer', 'employee_salary']
      }
    ];

    return items.filter(item => item.roles.includes(user?.role || ''));
  };

  const getNavItems = () => {
    const items = [
      { label: 'Dashboard', path: '/' },
      {
        label: 'Fahrzeuge',
        isDropdown: true,
        items: getVehicleMenuItems()
      },
      { label: 'Support', path: '/support' },
      { label: 'News', path: '/news' },
      { label: 'FAQ', path: '/faqs' }
    ];

    if (user?.role === 'employer') {
      items.splice(2, 0,
        { label: 'Mitarbeiter', path: '/employees' },
        { label: 'Ihre Bestellungen', path: '/orders' },
        { label: 'Anfragen', path: '/requests' },
        { label: 'Vorteilsrechner', path: '/benefits' }
      );
    } else if (user?.role === 'admin') {
      items.splice(2, 0,
        { label: 'Mitarbeiter', path: '/employees' },
        { label: 'Anfragen', path: '/requests' },
        { label: 'Vorteilsrechner', path: '/benefits' }
      );
    } else if (user?.role === 'employee_normal' || user?.role === 'employee_salary' || user?.role === 'customer') {
      if (user?.role === 'employee_salary') {
        items.splice(2, 0,
          { label: 'Ihre Bestellungen', path: '/orders' },
          { label: 'Anfragen', path: '/requests' }
        );
      } else {
        items.splice(2, 0,
          { label: 'Ihre Bestellungen', path: '/orders' }
        );
      }
    }

    if (user?.role === 'broker') {
      items.splice(2, 0,
        { label: 'Unternehmen', path: '/broker-companies' },
        { label: 'Broker', path: '/brokers' },
        { label: 'Ihre Bestellungen', path: '/orders' },
        { label: 'Bestellungen', path: '/broker-orders' }
      );
    }

    return items;
  };

  const isVehiclePath = (path: string) => path.startsWith('/vehicles/');

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto">
        <div className="h-16 px-6 flex items-center justify-between">
          {/* User Menu and Settings on the Left */}
          <div className="relative flex items-center space-x-4" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              {user?.firstName} {user?.lastName}
            </button>

            {isUserMenuOpen && (
              <UserDropdown
                user={user}
                onProfileClick={handleProfileClick}
                onCompanyDataClick={handleCompanyDataClick}
                onSignOut={handleSignOut}
                anchorRect={userMenuRef.current?.getBoundingClientRect() || null}
                dropdownRef={userDropdownRef}
              />
            )}

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `text-gray-700 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-gray-200' : 'hover:bg-gray-200'
                }`
              }
            >
              Settings
            </NavLink>

            {(user?.role === 'employee_normal' || user?.role === 'employee_salary') && !user?.isProfileComplete && (
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Daten vervollständigen
              </button>
            )}
          </div>

          {/* Navigation and Logo on the Right */}
          <div className="flex items-center space-x-8">
            <nav className="flex items-center space-x-4">
              {getNavItems().map((item: any) => (
                item.isDropdown ? (
                  <div key="vehicles" className="relative" ref={vehicleMenuRef}>
                    <button
                      onClick={() => setIsVehicleMenuOpen(!isVehicleMenuOpen)}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isVehiclePath(location.pathname)
                          ? 'bg-teal-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isVehicleMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isVehicleMenuOpen && item.items && (
                      <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                        {item.items.map((subItem: any) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                                isActive
                                  ? 'bg-teal-50 text-teal-600'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.path || item.label}
                    to={item.path || '/'}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-teal-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              ))}
            </nav>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Company Logo"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <h1 className="text-xl font-semibold text-gray-800">FahrzeugManager Pro</h1>
            )}
          </div>
        </div>
      </div>
      <DataCompletionModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </header>
  );
};

export default Header;
