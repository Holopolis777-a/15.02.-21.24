import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, Plus, X } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { useAuthStore } from '../store/authStore';
import { createTicket } from '../lib/firebase/services/ticketService';
import TicketForm from './support/TicketForm';
import { TicketFormData, TicketStatus } from '../types/ticket';

const Support = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tickets, isLoading } = useTickets();
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleCreateTicket = async (formData: TicketFormData, companyId?: string, companyName?: string) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      const ticketId = await createTicket(formData, user.id, companyId, companyName);
      setShowNewTicketForm(false);
      navigate(`/support/${ticketId}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'solved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Offen';
      case 'in_progress':
        return 'In Bearbeitung';
      case 'solved':
        return 'Gelöst';
      default:
        return status;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-40 text-gray-500">
            <div className="text-center">
              <LifeBuoy className="w-12 h-12 mx-auto mb-2" />
              <p>Support-Bereich wird geladen...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <select
            className="px-3 py-2 border rounded-md text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Alle Status</option>
            <option value="open">Offen</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="solved">Gelöst</option>
          </select>
        </div>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Neues Ticket
        </button>
      </div>

      {showNewTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Neues Ticket erstellen</h2>
              <button
                onClick={() => setShowNewTicketForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <TicketForm onSubmit={handleCreateTicket} isLoading={isSubmitting} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <li key={ticket.id}>
              <div
                onClick={() => navigate(`/support/${ticket.id}`)}
                className="block hover:bg-gray-50 cursor-pointer"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-blue-600 truncate">{ticket.title}</p>
                      {ticket.companyName && (
                        <span className="text-xs text-gray-500">| {ticket.companyName}</span>
                      )}
                      {ticket.author && (
                        <span className="text-xs text-gray-500">| {ticket.author.firstName} {ticket.author.lastName}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                      <span className="text-xs font-medium text-gray-600">
                        #{ticket.ticketNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Support;
