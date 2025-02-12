import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config';
import { sendEmployerInvite } from '../../email/brokerEmails';

export const inviteEmployer = async (email: string, brokerId: string) => {
  try {
    // Create company document first
    const companyRef = await addDoc(collection(db, 'companies'), {
      status: 'pending',
      brokerId: brokerId,
      createdAt: new Date(),
      email: email
    });

    // Create verification document
    const verificationRef = await addDoc(collection(db, 'verifications'), {
      type: 'employer_invite',
      email,
      brokerId: brokerId,
      companyId: companyRef.id,
      status: 'pending',
      createdAt: new Date(),
      verified: false
    });

    // Update company with verification ID
    await updateDoc(companyRef, {
      verificationId: verificationRef.id
    });

    // Send invitation email
    await sendEmployerInvite(email, verificationRef.id);

    return verificationRef.id;
  } catch (error) {
    console.error('Error inviting employer:', error);
    throw new Error('Fehler beim Einladen des Unternehmens');
  }
};
