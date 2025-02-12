import axios from 'axios';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const API_KEY = import.meta.env.VITE_BREVO_API_KEY;

export const sendCustomerInvitationEmail = async (email: string, inviteId: string, brokerId: string) => {
  try {
    const registrationUrl = `${window.location.origin}/register/customer?brokerId=${brokerId}&inviteId=${inviteId}`;
    
    // Get broker data
    const brokerDoc = await getDocs(
      query(collection(db, 'users'), where('id', '==', brokerId))
    );
    const brokerData = brokerDoc.docs[0]?.data();

    // Split email into parts for name
    const emailParts = email.split('@');
    const namePart = emailParts[0];
    const firstName = namePart.split('.')[0] || '';
    const lastName = namePart.split('.')[1] || '';

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "FahrzeugManager Pro",
          email: "viktor@vilonda.de"
        },
        to: [{ email, name: email }],
        subject: "Einladung zum Customer Portal",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Willkommen bei FahrzeugManager Pro!</h2>
            <p>Sehr geehrte/r ${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)},</p>
            <p>Sie wurden eingeladen, sich im Customer Portal zu registrieren.</p>
            <p>Klicken Sie auf den folgenden Button, um die Registrierung abzuschließen:</p>
            <a href="${registrationUrl}" 
               style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; 
                      text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Registrierung abschließen
            </a>
            <p>Der Link ist bis zum ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} gültig.</p>
            <div style="margin-top: 20px;">
              <p>Ihr Makler: ${brokerData?.fullName || 'Ihr Makler'}</p>
              ${brokerData?.email ? `<p>E-Mail: ${brokerData.email}</p>` : ''}
              ${brokerData?.phoneNumber ? `<p>Telefon: ${brokerData.phoneNumber}</p>` : ''}
            </div>
            <div style="margin-top: 40px; font-size: 12px; color: #666;">
              <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.</p>
            </div>
          </div>
        `
      },
      {
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Customer invitation email sent successfully:', {
      messageId: response.data.messageId,
      email
    });
    return response.data;
  } catch (error) {
    console.error('Error sending customer invitation email:', error);
    throw error;
  }
};

export const sendCustomerVerificationEmail = async (email: string, name: string) => {
  console.log('Attempting to send customer verification email', { email, name });
  try {
    const verificationUrl = `${window.location.origin}/verify-email?email=${encodeURIComponent(email)}`;
    console.log('Verification URL:', verificationUrl);

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "FahrzeugManager Pro",
          email: "viktor@vilonda.de"
        },
        to: [{ email, name }],
        templateId: 14,
        params: {
          name: name,
          verification_link: verificationUrl
        }
      },
      {
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Customer verification email sent successfully:', {
      messageId: response.data.messageId,
      email
    });
    return response.data;
  } catch (error) {
    console.error('Error sending customer verification email:', error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', error.response?.data || error.message);
    }
    throw error;
  }
};
