import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../../types/ticket';
import { formatDistanceToNow } from '../../../utils/dateUtils';

interface TicketListItemProps {
  ticket: Ticket;
}

const TicketListItem: React.FC<TicketListItemProps> = ({ ticket }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/support/tickets/${ticket.id}`)}
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{ticket.description}</p>
        </div>
        <div className="ml-6 flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              #{ticket.ticketNumber}
            </span>
            <span className="text-xs text-gray-500">
              {(() => {
                if (!ticket.createdAt) return '';
                try {
                  const date = new Date(ticket.createdAt);
                  if (isNaN(date.getTime())) return '';
                  return date.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }) + ' Uhr';
                } catch (e) {
                  console.error('Error formatting date:', e);
                  return '';
                }
              })()}
            </span>
          </div>
          <span className={`mt-1 px-2 py-1 rounded-md text-xs font-medium
            ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'solved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'}`}>
            {ticket.status === 'open' ? 'Offen' :
             ticket.status === 'in_progress' ? 'In Bearbeitung' :
             ticket.status === 'solved' ? 'Gelöst' : 'Unbekannt'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketListItem;
