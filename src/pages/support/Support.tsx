import React, { useState } from 'react';
import { Plus, LifeBuoy, X } from 'lucide-react';
import TicketList from './components/TicketList';
import TicketForm from './TicketForm';
import { createTicket } from '../../lib/firebase/services/ticketService';
import { useAuthStore } from '../../store/authStore';

const Support = () => {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LifeBuoy className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ticket erstellen
        </button>
      </div>

      {showNewTicket ? (
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Neues Ticket erstellen</h2>
            <button
              onClick={() => setShowNewTicket(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            )}
            <TicketForm
              isLoading={isSubmitting}
              onSubmit={async (data) => {
                if (!user) return;
                setError(null);
                setIsSubmitting(true);
                try {
                  await createTicket(data, user.id);
                  setShowNewTicket(false);
                } catch (error) {
                  console.error('Error creating ticket:', error);
                  setError('Fehler beim Erstellen des Tickets. Bitte versuchen Sie es erneut.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            />
          </div>
        </div>
      ) : (
        <TicketList />
      )}
    </div>
  );
};

export default Support;
