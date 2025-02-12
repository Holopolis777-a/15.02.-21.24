import React, { useState } from 'react';
import { FAQ } from '../../../types/faq';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { deleteFAQ } from '../../../lib/firebase/faq';

interface FAQItemProps {
  faq: FAQ;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq }) => {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    if (!window.confirm('Möchten Sie diese FAQ wirklich löschen?')) return;
    
    setIsDeleting(true);
    try {
      await deleteFAQ(faq.id);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{faq.title}</h3>
            
            {isAdmin && (
              <div className="flex items-center space-x-2 mt-2">
                {faq.targets.map((target) => (
                  <span
                    key={target}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {target}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => {/* TODO: Implement edit */}}
                className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Weniger anzeigen
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Mehr anzeigen
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 prose prose-sm max-w-none">
            {faq.imageUrl && (
              <img
                src={faq.imageUrl}
                alt={faq.title}
                className="w-full max-w-2xl rounded-lg mb-4"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: faq.content }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQItem;