import { collection, addDoc, updateDoc, doc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config';
import { TicketFormData, TicketAttachment, TicketCategory, TicketPriority } from '../../../types/ticket';
import { v4 as uuidv4 } from 'uuid';

export const updateTicketStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'solved') => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw new Error('Failed to update ticket status');
  }
};

export const addComment = async (
  ticketId: string,
  content: string,
  userId: string,
  attachments: File[] = []
) => {
  try {
    const commentAttachments: TicketAttachment[] = [];
    
    // Upload attachments if any
    if (attachments.length > 0) {
      for (const file of attachments) {
        const fileId = uuidv4();
        const fileRef = ref(storage, `tickets/${ticketId}/comments/${fileId}/attachments/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);

        commentAttachments.push({
          id: fileId,
          fileName: file.name,
          fileUrl,
          fileSize: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          uploadedBy: userId
        });
      }
    }

    const comment = {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: userId,
      attachments: commentAttachments,
      isInternal: false
    };

    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      comments: arrayUnion(comment),
      updatedAt: serverTimestamp()
    });

    return comment.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

export const updateTicket = async (
  ticketId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
    assignedTo?: string;
  }
) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw new Error('Failed to update ticket');
  }
};

export const createTicket = async (
  formData: TicketFormData,
  userId: string,
  companyId?: string,
  companyName?: string
) => {
  try {
    // Generate ticket number (current timestamp + random string)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketNumber = `${timestamp}-${randomStr}`;

    interface TicketData {
      ticketNumber: string;
      title: string;
      description: string;
      category: TicketCategory;
      priority: TicketPriority;
      status: string;
      createdAt: any;
      updatedAt: any;
      createdBy: string;
      attachments: never[];
      comments: never[];
      companyId?: string;
      companyName?: string;
    }

    // Create ticket document
    const ticketData: TicketData = {
      ticketNumber,
      title: formData.title,
      description: formData.description,
      category: 'other', // Default category
      priority: 'medium', // Default priority
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      attachments: [],
      comments: []
    };

    // Only add company fields if they are defined
    if (companyId) {
      ticketData.companyId = companyId;
    }
    if (companyName) {
      ticketData.companyName = companyName;
    }

    const ticketRef = await addDoc(collection(db, 'tickets'), ticketData);

    // Update with ID
    await updateDoc(doc(db, 'tickets', ticketRef.id), {
      id: ticketRef.id
    });

    return ticketRef.id;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw new Error('Failed to create ticket');
  }
};
