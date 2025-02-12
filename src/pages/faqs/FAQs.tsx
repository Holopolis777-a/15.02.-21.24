import React, { useState } from 'react';
import { HelpCircle, Plus } from 'lucide-react';
import FAQList from './components/FAQList';
import FAQEditor from './components/editor/FAQEditor';
import { useAuthStore } from '../../store/authStore';

const FAQs = () => {
  const { user } = useAuthStore();
  const [showEditor, setShowEditor] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            FAQ erstellen
          </button>
        )}
      </div>
      
      <FAQList />

      {showEditor && (
        <FAQEditor
          onClose={() => setShowEditor(false)}
          onSave={() => {
            // List will automatically refresh via Firebase listeners
            setShowEditor(false);
          }}
        />
      )}
    </div>
  );
};

export default FAQs;