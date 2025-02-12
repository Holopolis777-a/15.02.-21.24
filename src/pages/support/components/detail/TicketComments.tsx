import React, { useState } from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { Ticket, TicketComment } from '../../../../types/ticket';
import CommentForm from './comments/CommentForm';
import CommentList from './comments/CommentList';
import { addComment } from '../../../../utils/ticketUtils';

interface TicketCommentsProps {
  ticket: Ticket;
}

const TicketComments: React.FC<TicketCommentsProps> = ({ ticket }) => {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';

  const handleSubmit = async (content: string, isInternal: boolean, attachments: File[]) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await addComment(ticket.id, {
        content,
        isInternal,
        attachments
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Fehler beim Hinzufügen des Kommentars');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Kommentare
        </h3>
      </div>

      <CommentList 
        comments={ticket.comments || []} 
        isAdmin={isAdmin}
      />

      {error && (
        <div className="px-6 py-4 bg-red-50 border-t border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="p-6">
        <CommentForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          showInternalOption={isAdmin}
        />
      </div>
    </div>
  );
};

export default TicketComments;