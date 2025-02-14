import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Template IDs from Brevo
const TEMPLATES = {
  COMPANY_INVITATION: 23, // "Employer Invitation" template ID
  COMPANY_REMINDER: 6    // "Company Reminder" template ID
};

interface CompanyEmailParams {
  email: string;
  companyName: string;
  contactPerson: string;
  verificationUrl: string;
  brokerName?: string;  // Name of the broker who sent the invitation
}

export const sendCompanyInvitation = async (params: CompanyEmailParams) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = TEMPLATES.COMPANY_INVITATION;
    sendSmtpEmail.to = [{ email: params.email, name: params.contactPerson }];
    sendSmtpEmail.params = {
      contactPerson: params.contactPerson,
      companyName: params.companyName,
      verificationUrl: params.verificationUrl,
      brokerName: params.brokerName
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Company invitation email sent successfully:', {
      messageId: result.messageId,
      email: params.email
    });
    return result;
  } catch (error) {
    console.error('Error sending company invitation email:', { error, params });
    throw error;
  }
};

export const sendCompanyReminder = async (params: CompanyEmailParams) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = TEMPLATES.COMPANY_REMINDER;
    sendSmtpEmail.to = [{ email: params.email, name: params.contactPerson }];
    sendSmtpEmail.params = {
      contactPerson: params.contactPerson,
      companyName: params.companyName,
      verificationUrl: params.verificationUrl
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Company reminder email sent successfully:', {
      messageId: result.messageId,
      email: params.email
    });
    return result;
  } catch (error) {
    console.error('Error sending company reminder email:', { error, params });
    throw error;
  }
};
