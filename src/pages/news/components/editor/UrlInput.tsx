import React from 'react';
import { Link } from 'lucide-react';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ value, onChange }) => {
  const validateUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Externe URL (optional)
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Link className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            !validateUrl(value) ? 'border-red-300' : ''
          }`}
          placeholder="https://example.com"
        />
      </div>
      {value && !validateUrl(value) && (
        <p className="mt-1 text-sm text-red-600">
          Bitte geben Sie eine gültige URL ein
        </p>
      )}
    </div>
  );
};

export default UrlInput;