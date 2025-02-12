import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

interface AdminInviteEmailParams {
  email: string;
  firstName: string;
  verificationUrl: string;
}

export const sendAdminInvitationEmail = async (params: AdminInviteEmailParams) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = "Einladung als Administrator bei FahrzeugManager Pro";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Willkommen bei FahrzeugManager Pro!</h2>
        <p>Sehr geehrte(r) ${params.firstName},</p>
        <p>Sie wurden als Administrator eingeladen.</p>
        <p>Um Ihre Registrierung abzuschließen, klicken Sie bitte auf den folgenden Button:</p>
        <a href="${params.verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Registrierung abschließen
        </a>
        <p>Dieser Link ist 48 Stunden gültig.</p>
        <div style="margin-top: 40px; font-size: 12px; color: #666;">
          <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.</p>
        </div>
      </div>
    `;

    sendSmtpEmail.sender = { 
      name: "FahrzeugManager Pro", 
      email: "viktor@vilonda.de" 
    };
    sendSmtpEmail.to = [{ email: params.email }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error('Error sending admin invitation email:', error);
    throw error;
  }
};