import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Ticket } from '../types/ticket';

export const useTicketDetail = (ticketId: string | undefined) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false);
      setError('Ticket ID fehlt');
      return;
    }

    const ticketRef = doc(db, 'tickets', ticketId);

    // Set up real-time listener for ticket updates
    const unsubscribe = onSnapshot(
      ticketRef,
      async (docSnapshot) => {
        if (!docSnapshot.exists()) {
          setTicket(null);
          setError('Ticket nicht gefunden');
          setIsLoading(false);
          return;
        }

        const ticketData = docSnapshot.data() as Ticket;

        // Fetch author data if available
        if (ticketData.createdBy) {
          const authorDoc = await getDoc(doc(db, 'users', ticketData.createdBy));
          if (authorDoc.exists()) {
            const authorData = authorDoc.data();
            ticketData.author = {
              id: authorDoc.id,
              email: authorData.email || '',
              role: authorData.role || 'customer',
              firstName: authorData.firstName || '',
              lastName: authorData.lastName || '',
              avatarUrl: authorData.avatarUrl,
              companyId: authorData.companyId,
              brokerId: authorData.brokerId
            };
          }
        }

        // Fetch assignee data if available
        if (ticketData.assignedTo) {
          const assigneeDoc = await getDoc(doc(db, 'users', ticketData.assignedTo));
          if (assigneeDoc.exists()) {
            const assigneeData = assigneeDoc.data();
            ticketData.assignee = {
              id: assigneeDoc.id,
              email: assigneeData.email || '',
              role: assigneeData.role || 'customer',
              firstName: assigneeData.firstName || '',
              lastName: assigneeData.lastName || '',
              avatarUrl: assigneeData.avatarUrl,
              companyId: assigneeData.companyId,
              brokerId: assigneeData.brokerId
            };
          }
        }

        // Fetch comment authors
        if (ticketData.comments) {
          const commentsWithAuthors = await Promise.all(
            ticketData.comments.map(async (comment) => {
              if (comment.createdBy) {
                const authorDoc = await getDoc(doc(db, 'users', comment.createdBy));
                if (authorDoc.exists()) {
                  const authorData = authorDoc.data();
                  return {
                    ...comment,
                    author: {
                      id: authorDoc.id,
                      email: authorData.email || '',
                      role: authorData.role || 'customer',
                      firstName: authorData.firstName || '',
                      lastName: authorData.lastName || '',
                      avatarUrl: authorData.avatarUrl,
                      companyId: authorData.companyId,
                      brokerId: authorData.brokerId
                    }
                  };
                }
              }
              return comment;
            })
          );
          ticketData.comments = commentsWithAuthors;
        }

        setTicket(ticketData);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching ticket:', err);
        setError('Fehler beim Laden des Tickets');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ticketId]);

  return { ticket, isLoading, error };
};
