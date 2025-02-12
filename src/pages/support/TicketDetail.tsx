import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketDetail } from '../../hooks/useTicketDetail';
import { getPriorityBadgeProps } from '../../utils/ticketUtils';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { AlertTriangle, Edit2, ArrowLeft } from 'lucide-react';
import { updateTicket, updateTicketStatus, addComment } from '../../lib/firebase/services/ticketService';
import { TicketStatus, TicketPriority, TicketCategory } from '../../types/ticket';
import { useAuthStore } from '../../store/authStore';

interface EditFormData {
  title: string;
  description: string;
}

const TicketDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { ticketId } = useParams();
  const { ticket, isLoading, error } = useTicketDetail(ticketId);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticketId) return;
    try {
      setIsSubmitting(true);
      await updateTicketStatus(ticketId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (!ticket) return;
    setEditFormData({
      title: ticket.title,
      description: ticket.description
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!ticketId || !editFormData) return;
    try {
      setIsSubmitting(true);
      await updateTicket(ticketId, editFormData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error || 'Ticket nicht gefunden'}</span>
        </div>
      </div>
    );
  }

  const { bgColor, textColor, label } = getPriorityBadgeProps(ticket.priority);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/support')}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white rounded-md shadow hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          {isEditing ? (
            <div className="w-full">
              <input
                type="text"
                value={editFormData?.title}
                onChange={(e) => setEditFormData(prev => prev ? {...prev, title: e.target.value} : null)}
                className="w-full px-3 py-2 border rounded-md mb-2"
              />
              <textarea
                value={editFormData?.description}
                onChange={(e) => setEditFormData(prev => prev ? {...prev, description: e.target.value} : null)}
                className="w-full px-3 py-2 border rounded-md mb-2"
                rows={3}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">#{ticket.ticketNumber}</span>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                  {label}
                </span>
                {user?.role === 'admin' && (
                  <button
                    onClick={handleEdit}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {ticket.companyName && (
                <div className="mt-1 text-sm text-gray-600">
                  Firma: {ticket.companyName}
                </div>
              )}
              {ticket.author && (
                <div className="mt-1 text-sm text-gray-600">
                  Von: {ticket.author.firstName} {ticket.author.lastName}
                </div>
              )}
              <p className="mt-2 text-gray-600">{ticket.description}</p>
            </div>
          )}
          <div className="flex flex-col items-end space-y-2">
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(ticket.createdAt))}
            </span>
            {user?.role === 'admin' ? (
              <div className="flex items-center space-x-2">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                  className={`px-2 py-1 rounded-md text-xs font-medium border
                    ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-green-100 text-green-800 border-green-200'}`}
                  disabled={isSubmitting}
                >
                  <option value="open">Offen</option>
                  <option value="in_progress">In Bearbeitung</option>
                  <option value="solved">Gelöst</option>
                </select>
              </div>
            ) : (
              <div className={`px-2 py-1 rounded-md text-xs font-medium
                ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                  ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'}`}
              >
                {ticket.status === 'open' ? 'Offen' :
                 ticket.status === 'in_progress' ? 'In Bearbeitung' :
                 'Gelöst'}
              </div>
            )}
          </div>
        </div>

        {ticket.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Anhänge</h3>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {ticket.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {attachment.fileName}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {Math.round(attachment.fileSize / 1024)} KB
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {ticket.comments.length > 0 && (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {ticket.comments.map((comment) => (
            <div key={comment.id} className="p-6">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {comment.author?.firstName} {comment.author?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </p>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    <p>{comment.content}</p>
                  </div>
                  {comment.attachments.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {comment.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-2 border rounded hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-700 truncate">
                              {attachment.fileName}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Neuer Kommentar</h3>
        <div className="space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Schreiben Sie hier Ihren Kommentar..."
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
          
          <div className="flex justify-end">
            <button
              onClick={async () => {
                if (!ticketId || !commentText.trim()) return;
                try {
                  setIsSubmitting(true);
                  await addComment(ticketId, commentText, user?.id || '', []);
                  setCommentText('');
                } catch (error) {
                  console.error('Error adding comment:', error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting || !commentText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Wird gesendet...' : 'Kommentar senden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
