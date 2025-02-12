import { addDoc, collection, getDocs, query, where, Timestamp, updateDoc, doc, writeBatch, setDoc } from 'firebase/firestore';
import { db } from '../config';
import { CustomerInvite } from '../../../types/customer';
import { sendCustomerInvitationEmail } from '../../email/customerEmails';

const COLLECTION_NAME = 'customerInvites';
const VERIFICATIONS_COLLECTION = 'verifications';

export const generateCustomerInviteLink = async (brokerId: string): Promise<CustomerInvite> => {
  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(now.getDate() + 7); // Invite expires in 7 days

  const inviteData = {
    brokerId,
    status: 'pending',
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
    type: 'link'
  };

  try {
    // Create the verification document first
    const verificationRef = doc(collection(db, VERIFICATIONS_COLLECTION));
    const verificationData = {
      type: 'customer_invite',
      brokerId,
      status: 'pending',
      createdAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt)
    };

    // Use a batch to ensure both documents are created
    const batch = writeBatch(db);
    
    // Set the verification document
    batch.set(verificationRef, verificationData);

    // Set the customer invite document with the same ID
    const inviteRef = doc(db, COLLECTION_NAME, verificationRef.id);
    batch.set(inviteRef, {
      ...inviteData,
      verificationId: verificationRef.id
    });

    // Commit both documents
    await batch.commit();

    return {
      id: inviteRef.id,
      ...inviteData,
      createdAt: now,
      expiresAt
    } as CustomerInvite;
  } catch (error) {
    console.error('Error generating customer invite link:', error);
    throw error;
  }
};

export const createCustomerInvite = async (email: string, brokerId: string): Promise<CustomerInvite> => {
  // Check if there's already a pending invite
  const existingInvites = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where('email', '==', email),
      where('status', '==', 'pending')
    )
  );

  if (!existingInvites.empty) {
    throw new Error('Eine Einladung für diese E-Mail-Adresse existiert bereits');
  }

  const now = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(now.getDate() + 7); // Invite expires in 7 days

  const inviteData = {
    email,
    brokerId,
    status: 'pending',
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt)
  };

  try {
    // Create the verification document first
    const verificationRef = doc(collection(db, VERIFICATIONS_COLLECTION));
    const verificationData = {
      type: 'customer_invite',
      email,
      brokerId,
      status: 'pending',
      createdAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt)
    };

    // Use a batch to ensure both documents are created or neither is
    const batch = writeBatch(db);
    
    // Set the verification document
    batch.set(verificationRef, verificationData);

    // Set the customer invite document with the same ID
    const inviteRef = doc(db, COLLECTION_NAME, verificationRef.id);
    batch.set(inviteRef, {
      ...inviteData,
      verificationId: verificationRef.id
    });

    // Commit both documents
    await batch.commit();

    // Send invitation email
    await sendCustomerInvitationEmail(email, inviteRef.id, brokerId);

    return {
      id: inviteRef.id,
      ...inviteData,
      createdAt: now,
      expiresAt
    } as CustomerInvite;
  } catch (error) {
    console.error('Error creating customer invite:', error);
    throw error;
  }
};

export const getCustomerInvite = async (inviteId: string): Promise<CustomerInvite> => {
  const inviteRef = doc(db, COLLECTION_NAME, inviteId);
  const inviteSnap = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where('__name__', '==', inviteId)
    )
  );

  if (inviteSnap.empty) {
    throw new Error('Einladung nicht gefunden');
  }

  const inviteData = inviteSnap.docs[0].data();
  
  // Check if invite has expired
  if (inviteData.expiresAt.toDate() < new Date()) {
    await updateDoc(inviteRef, { status: 'expired' });
    throw new Error('Diese Einladung ist abgelaufen');
  }

  return {
    id: inviteSnap.docs[0].id,
    ...inviteData,
    createdAt: inviteData.createdAt.toDate(),
    expiresAt: inviteData.expiresAt.toDate()
  } as CustomerInvite;
};

export const acceptCustomerInvite = async (inviteId: string): Promise<void> => {
  try {
    const inviteRef = doc(db, COLLECTION_NAME, inviteId);
    const verificationRef = doc(db, VERIFICATIONS_COLLECTION, inviteId);
    
    const batch = writeBatch(db);
    batch.update(inviteRef, { status: 'accepted' });
    batch.update(verificationRef, { status: 'accepted' });
    
    await batch.commit();
  } catch (error) {
    console.error('Error accepting customer invite:', error);
    throw error;
  }
};

export const getCustomerInvitesByBroker = async (brokerId: string): Promise<CustomerInvite[]> => {
  const invitesSnap = await getDocs(
    query(
      collection(db, COLLECTION_NAME),
      where('brokerId', '==', brokerId)
    )
  );

  return invitesSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    expiresAt: doc.data().expiresAt.toDate()
  })) as CustomerInvite[];
};
