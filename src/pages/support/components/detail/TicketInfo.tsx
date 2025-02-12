import React from 'react';
import { Calendar, Tag, User } from 'lucide-react';
import { Ticket } from '../../../../types/ticket';
import { formatDistanceToNow } from '../../../../utils/dateUtils';

interface TicketInfoProps {
  ticket: Ticket;
}

const TicketInfo: React.FC<TicketInfoProps> = ({ ticket }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Erstellt</p>
              <p className="text-sm text-gray-900">
                {formatDistanceToNow(new Date(ticket.createdAt))}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Tag className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Kategorie</p>
              <p className="text-sm text-gray-900">
                {ticket.category === 'technical' ? 'Technisch' :
                 ticket.category === 'billing' ? 'Abrechnung' :
                 ticket.category === 'vehicle' ? 'Fahrzeug' :
                 ticket.category === 'account' ? 'Benutzerkonto' : 'Sonstiges'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Erstellt von</p>
              <p className="text-sm text-gray-900">
                {ticket.author?.firstName} {ticket.author?.lastName}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-900">Beschreibung</h3>
          <div className="mt-2 text-sm text-gray-500 whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfo;