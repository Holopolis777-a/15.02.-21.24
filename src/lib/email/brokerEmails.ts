import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { BrokerEmailData } from '../../types/broker';

// Initialize Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Template IDs from Brevo
const TEMPLATES = {
  BROKER_INVITATION: 7,
  EMPLOYER_INVITATION: 8, // Add appropriate template ID
};

export const sendBrokerInvitationEmail = async (email: string, inviteId: string, fullName: string) => {
  try {
    const verificationUrl = `${window.location.origin}/verify/broker/${inviteId}`;
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = TEMPLATES.BROKER_INVITATION;
    sendSmtpEmail.to = [{ email, name: fullName }];
    sendSmtpEmail.params = {
      broker_name: fullName,
      verificationUrl
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Broker invitation email sent successfully:', {
      messageId: result.messageId,
      email
    });
    return result;
  } catch (error) {
    console.error('Error sending broker invitation email:', error);
    throw error;
  }
};

export const sendBrokerWelcomeEmail = async (data: BrokerEmailData) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.templateId = 1; // Use a welcome template ID
    sendSmtpEmail.to = [{ email: data.email, name: data.fullName }];
    
    // Add tracking parameters
    sendSmtpEmail.params = {
      brokerId: data.brokerId,
      verificationToken: data.verificationToken
    };

    // Send email and get tracking info
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending broker welcome email:', error);
    throw error;
  }
};

export const sendEmployerInvite = async (email: string, inviteId: string) => {
  try {
    const verificationUrl = `${window.location.origin}/verify/employer/${inviteId}`;
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = TEMPLATES.EMPLOYER_INVITATION;
    sendSmtpEmail.to = [{ email, name: email }];
    sendSmtpEmail.params = {
      verificationUrl
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Employer invitation email sent successfully:', {
      messageId: result.messageId,
      email
    });
    return result;
  } catch (error) {
    console.error('Error sending employer invitation email:', error);
    throw error;
  }
};

export const sendBrokerActivationReminder = async (data: BrokerEmailData) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.templateId = 2; // Use a reminder template ID
    sendSmtpEmail.to = [{ email: data.email, name: data.fullName }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending activation reminder:', error);
    throw error;
  }
};
