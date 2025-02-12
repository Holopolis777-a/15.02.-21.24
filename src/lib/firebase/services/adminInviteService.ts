import { addDoc, collection, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';
import { sendAdminInvitationEmail } from '../email/adminEmails';
import { generateToken } from '../../utils/tokenUtils';

export const createAdminInvitation = async (email: string, firstName: string, lastName: string) => {
  try {
    // Create invitation document
    const inviteRef = await addDoc(collection(db, 'admin_invites'), {
      email: email.toLowerCase(),
      firstName,
      lastName,
      token: generateToken(32),
      status: 'pending',
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      emailSent: false
    });

    // Generate verification URL
    const verificationUrl = `${window.location.origin}/admin/verify/${inviteRef.id}`;

    // Send invitation email
    await sendAdminInvitationEmail({
      email,
      firstName,
      verificationUrl
    });

    // Update invitation status
    await updateDoc(doc(db, 'admin_invites', inviteRef.id), {
      emailSent: true,
      emailSentAt: serverTimestamp()
    });

    return inviteRef.id;
  } catch (error) {
    console.error('Error creating admin invitation:', error);
    throw new Error('Fehler beim Erstellen der Einladung');
  }
};

export const verifyAdminInvitation = async (inviteId: string) => {
  const inviteRef = doc(db, 'admin_invites', inviteId);
  const invite = await getDoc(inviteRef);

  if (!invite.exists()) {
    throw new Error('Ungültige Einladung');
  }

  const inviteData = invite.data();
  const now = new Date();
  const expiresAt = inviteData.expiresAt.toDate();

  if (now > expiresAt) {
    throw new Error('Diese Einladung ist abgelaufen');
  }

  if (inviteData.status !== 'pending') {
    throw new Error('Diese Einladung wurde bereits verwendet');
  }

  return inviteData;
};