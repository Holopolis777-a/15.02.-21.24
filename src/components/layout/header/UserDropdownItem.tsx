import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface UserDropdownItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  showArrow?: boolean;
  variant?: 'default' | 'danger';
}

const UserDropdownItem: React.FC<UserDropdownItemProps> = ({
  icon: Icon,
  label,
  onClick,
  showArrow,
  variant = 'default'
}) => {
  const baseClasses = "w-full px-4 py-3 text-left text-sm flex items-center cursor-pointer transition-colors duration-150";
  const variantClasses = {
    default: "text-gray-700 hover:bg-gray-100",
    danger: "text-red-600 hover:bg-red-50"
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`${baseClasses} ${variantClasses[variant]} ${showArrow ? 'justify-between' : ''}`}
    >
      <div className="flex items-center">
        <Icon className="w-4 h-4 mr-3" />
        <span>{label}</span>
      </div>
      {showArrow && <ChevronRight className="w-4 h-4 text-gray-400" />}
    </button>
  );
};

export default UserDropdownItem;
