import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { EmailLogEntry } from '../../types/company';
import { sendCompanyInvitation, sendCompanyReminder } from '../firebase/email/companyInvitationEmails';

export const sendCompanyVerificationEmail = async (email: string, companyData: any) => {
  try {
    // Create verification document
    const verificationRef = await addDoc(collection(db, 'verifications'), {
      email,
      companyData,
      type: 'company_verification',
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      verified: false,
      emailSent: false
    });

    // Generate verification URL
    const verificationUrl = `${window.location.origin}/verify/${verificationRef.id}`;

    // Send email using Brevo
    await sendCompanyInvitation({
      email,
      companyName: companyData.name,
      contactPerson: companyData.contactPerson,
      verificationUrl
    });

    // Update verification document
    await updateDoc(verificationRef, {
      emailSent: true,
      emailSentAt: new Date().toISOString()
    });

    return verificationRef.id;
  } catch (error) {
    console.error('Error sending verification:', error);
    throw error;
  }
};

export const resendCompanyInvitation = async (companyId: string, email: string) => {
  try {
    // Get company document
    const companyRef = doc(db, 'companies', companyId);
    const companyDoc = await getDoc(companyRef);
    
    if (!companyDoc.exists()) {
      throw new Error('Unternehmen nicht gefunden');
    }

    const company = companyDoc.data();
    const now = new Date();

    // Create verification document
    const verificationRef = await addDoc(collection(db, 'verifications'), {
      email,
      companyId,
      type: 'company_invitation_resend',
      createdAt: serverTimestamp(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      verified: false,
      emailSent: false
    });

    // Generate verification URL
    const verificationUrl = `${window.location.origin}/verify/${verificationRef.id}`;

    // Send reminder email using Brevo
    await sendCompanyReminder({
      email,
      companyName: company.name,
      contactPerson: company.contactPerson,
      verificationUrl
    });

    // Create log entry
    const logEntry: EmailLogEntry = {
      type: 'reminder',
      sentAt: now.toISOString(),
      success: true
    };

    // Update company document
    await updateDoc(companyRef, {
      lastInviteSent: now.toISOString(),
      emailLog: [...(company.emailLog || []), logEntry]
    });

    return verificationRef.id;
  } catch (error) {
    console.error('Error resending invitation:', error);
    throw error;
  }
};