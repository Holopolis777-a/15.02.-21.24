import { generateToken } from './tokenUtils';
import { sendBrokerWelcomeEmail, sendBrokerActivationReminder } from '../lib/email/brokerEmails';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { BrokerEmailData } from '../types/broker';

export const generateBrokerVerificationToken = () => {
  return generateToken(32); // Generate a secure 32-character token
};

export const createBrokerVerificationUrl = (token: string) => {
  const baseUrl = import.meta.env.VITE_APP_URL;
  return `${baseUrl}/verify/broker/${token}`;
};

export const handleBrokerInvitation = async (brokerData: BrokerEmailData) => {
  try {
    // Generate verification token
    const verificationToken = generateBrokerVerificationToken();
    const setupUrl = createBrokerVerificationUrl(verificationToken);
    const portalUrl = `${import.meta.env.VITE_APP_URL}/login`;

    // Send welcome email
    const emailResult = await sendBrokerWelcomeEmail({
      ...brokerData,
      verificationToken,
      setupUrl,
      portalUrl,
      logoUrl: 'https://example.com/logo.png' // Replace with actual logo URL
    });

    // Update broker document with verification info
    await updateDoc(doc(db, 'brokers', brokerData.brokerId), {
      verificationToken,
      verificationSentAt: new Date().toISOString(),
      verificationStatus: 'pending'
    });

    return {
      success: true,
      messageId: emailResult.messageId
    };
  } catch (error) {
    console.error('Error handling broker invitation:', error);
    throw error;
  }
};

export const sendBrokerReminder = async (brokerData: BrokerEmailData) => {
  try {
    // Generate new verification token
    const verificationToken = generateBrokerVerificationToken();
    const setupUrl = createBrokerVerificationUrl(verificationToken);
    const portalUrl = `${import.meta.env.VITE_APP_URL}/login`;

    // Send reminder email
    const emailResult = await sendBrokerActivationReminder({
      ...brokerData,
      verificationToken,
      setupUrl,
      portalUrl,
      logoUrl: 'https://example.com/logo.png' // Replace with actual logo URL
    });

    // Update broker document
    await updateDoc(doc(db, 'brokers', brokerData.brokerId), {
      verificationToken,
      verificationSentAt: new Date().toISOString(),
      reminderSentAt: new Date().toISOString()
    });

    return {
      success: true,
      messageId: emailResult.messageId
    };
  } catch (error) {
    console.error('Error sending broker reminder:', error);
    throw error;
  }
};