import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';
import { sendEmployerInvite } from '../../email/brokerEmails';

export const generateEmployerInviteLink = async (brokerId: string, email?: string) => {
  try {
    const companyRef = await addDoc(collection(db, 'companies'), {
      status: 'pending',
      brokerId: brokerId,
      createdAt: serverTimestamp(),
      email: email || null,
      verificationId: null
    });

    const verificationRef = await addDoc(collection(db, 'verifications'), {
      type: 'employer_invite',
      email: email || null,
      brokerId: brokerId,
      companyId: companyRef.id,
      status: 'pending',
      createdAt: serverTimestamp(),
      verified: false
    });

    await updateDoc(companyRef, {
      verificationId: verificationRef.id
    });

    return {
      id: verificationRef.id,
      companyId: companyRef.id
    };
  } catch (error) {
    console.error('Error generating employer invite link:', error);
    throw new Error('Fehler beim Generieren des Einladungslinks');
  }
};

export const inviteEmployer = async (email: string, brokerId: string) => {
  try {
    const companyRef = await addDoc(collection(db, 'companies'), {
      status: 'pending',
      brokerId: brokerId,
      createdAt: serverTimestamp(),
      email: email
    });

    const verificationRef = await addDoc(collection(db, 'verifications'), {
      type: 'employer_invite',
      email,
      brokerId: brokerId,
      companyId: companyRef.id,
      status: 'pending',
      createdAt: serverTimestamp(),
      verified: false
    });

    await updateDoc(companyRef, {
      verificationId: verificationRef.id
    });

    await sendEmployerInvite(email, verificationRef.id);

    return verificationRef.id;
  } catch (error) {
    console.error('Error inviting employer:', error);
    throw new Error('Fehler beim Einladen des Unternehmens');
  }
};
