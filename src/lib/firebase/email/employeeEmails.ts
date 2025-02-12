import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Template IDs from Brevo
const TEMPLATES = {
  MITARBEITER_PORTAL_INVITATION: 9, // Template ID for Mitarbeiter Portal
  SALARY_PORTAL_INVITATION: 10, // Template ID for Gehaltsumwandlungs Portal
};

interface EmployeeEmailParams {
  email: string;
  verificationUrl: string;
  portalType: 'normal' | 'salary';
}

export const sendEmployeeInvitationEmail = async (
  email: string,
  inviteId: string,
  portalType: 'normal' | 'salary'
) => {
  try {
    const verificationUrl = `${window.location.origin}/verify/employee/${inviteId}`;
    const portalName = portalType === 'normal' ? 'Mitarbeiter Portal' : 'Gehaltsumwandlungs Portal';
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = portalType === 'normal' 
      ? TEMPLATES.MITARBEITER_PORTAL_INVITATION 
      : TEMPLATES.SALARY_PORTAL_INVITATION;
    sendSmtpEmail.to = [{ email, name: 'Mitarbeiter' }];
    sendSmtpEmail.params = {
      portalName,
      verificationUrl
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Employee invitation email sent successfully:', {
      messageId: result.messageId,
      email,
      portalType
    });
    return result;
  } catch (error) {
    console.error('Error sending employee invitation email:', error);
    throw error;
  }
};
