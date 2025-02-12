import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { splitFullName } from '../../../utils/nameUtils';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Template IDs from Brevo
const TEMPLATES = {
  EMPLOYER_WELCOME: 4, // "Arbeitgeber-Einladung" template ID
  EMPLOYER_INVITE: 5 // "Arbeitgeber-Einladung (Verification)" template ID
};

interface EmployerInvitationParams {
  email: string;
  contactPerson: string;
  companyName: string;
  verificationId: string;
  verificationUrl: string;
}

interface EmployerWelcomeEmailParams {
  email: string;
  companyName: string;
  contactPerson: string;
  initialPassword: string;
  loginUrl: string;
}

export const sendEmployerInvitation = async (params: EmployerInvitationParams) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    // Set up template and parameters
    sendSmtpEmail.templateId = TEMPLATES.EMPLOYER_INVITE;
    
    // Split name safely
    const { firstName, lastName } = splitFullName(params.contactPerson);
    
    // Set up recipient
    sendSmtpEmail.to = [{ 
      email: params.email,
      name: params.contactPerson
    }];
    
    // Set template parameters
    sendSmtpEmail.params = {
      company: params.companyName,
      email: params.email,
      verification_url: params.verificationUrl,
      contact_person: params.contactPerson,
      first_name: firstName,
      last_name: lastName
    };

    // Add detailed logging
    console.log('Sending employer invitation email with params:', {
      email: params.email,
      templateId: TEMPLATES.EMPLOYER_INVITE,
      params: sendSmtpEmail.params
    });

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Employer invitation email sent successfully:', {
      messageId: result.messageId,
      email: params.email
    });
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending employer invitation email:', {
      error: errorMessage,
      params: {
        email: params.email,
        companyName: params.companyName,
        hasContactPerson: !!params.contactPerson
      }
    });
    throw new Error(`Fehler beim Senden der Einladungs-E-Mail: ${errorMessage}`);
  }
};

export const sendEmployerWelcomeEmail = async (params: EmployerWelcomeEmailParams) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    // Set up template and parameters
    sendSmtpEmail.templateId = TEMPLATES.EMPLOYER_WELCOME;
    
    // Split name safely
    const { firstName, lastName } = splitFullName(params.contactPerson);
    
    // Set up recipient
    sendSmtpEmail.to = [{ 
      email: params.email,
      name: params.contactPerson
    }];
    
    // Set template parameters exactly matching Brevo template variables
    sendSmtpEmail.params = {
      company: params.companyName,
      email: params.email,
      password: params.initialPassword,
      login_url: params.loginUrl,
      contact_person: params.contactPerson,
      first_name: firstName,
      last_name: lastName
    };

    // Add detailed logging
    console.log('Sending employer welcome email with params:', {
      email: params.email,
      templateId: TEMPLATES.EMPLOYER_WELCOME,
      params: sendSmtpEmail.params
    });

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Employer welcome email sent successfully:', {
      messageId: result.messageId,
      email: params.email
    });
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending employer welcome email:', {
      error: errorMessage,
      params: {
        email: params.email,
        companyName: params.companyName,
        hasContactPerson: !!params.contactPerson
      }
    });
    throw new Error(`Fehler beim Senden der Willkommens-E-Mail: ${errorMessage}`);
  }
};
