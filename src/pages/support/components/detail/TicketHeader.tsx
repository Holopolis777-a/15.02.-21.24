import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Ticket } from '../../../../types/ticket';
import { getPriorityBadgeProps } from '../../../../utils/ticketUtils';

interface TicketHeaderProps {
  ticket: Ticket;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ ticket }) => {
  const navigate = useNavigate();
  const { bgColor, textColor, label } = getPriorityBadgeProps(ticket.priority);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/support')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
              {label}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Ticket #{ticket.id.slice(0, 8)}
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-medium
          ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
            ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            ticket.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'}`}>
          {ticket.status === 'open' ? 'Offen' :
           ticket.status === 'in_progress' ? 'In Bearbeitung' :
           ticket.status === 'waiting' ? 'Wartend' : 'Geschlossen'}
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;