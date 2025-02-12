import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';
import { Ticket, TicketStatus } from '../../../../types/ticket';
import { useAuthStore } from '../../../../store/authStore';

interface AdminActionsProps {
  ticket: Ticket;
}

const AdminActions: React.FC<AdminActionsProps> = ({ ticket }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();

  const handleStatusChange = async (status: TicketStatus) => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'tickets', ticket.id), {
        status,
        assignedTo: user.id,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Admin-Aktionen
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status ändern
          </label>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            disabled={isUpdating}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="open">Offen</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="waiting">Wartend</option>
            <option value="closed">Geschlossen</option>
          </select>
        </div>

        {ticket.assignedTo === user?.id && (
          <div className="pt-4 border-t">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Dir zugewiesen
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActions;