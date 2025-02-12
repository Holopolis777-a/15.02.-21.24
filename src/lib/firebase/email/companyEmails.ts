import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Template IDs from Brevo
const TEMPLATES = {
  EMPLOYER_WELCOME: 4 // "Arbeitgeber-Einladung" template ID
};

interface EmployerWelcomeEmailParams {
  email: string;
  companyName: string;
  contactPerson: string;
  initialPassword: string;
  loginUrl: string;
}

export const sendEmployerWelcomeEmail = async (params: EmployerWelcomeEmailParams) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set up template and parameters
    sendSmtpEmail.templateId = TEMPLATES.EMPLOYER_WELCOME;

    // Set up recipient
    sendSmtpEmail.to = [{ 
      email: params.email,
      name: params.contactPerson
    }];

    // Set template parameters matching the email placeholders
    sendSmtpEmail.params = {
      contactPerson: params.contactPerson,
      companyName: params.companyName,
      email: params.email,
      initialPassword: params.initialPassword,
      loginUrl: params.loginUrl
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