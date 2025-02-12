import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendCompanyInvitation = async (
  email: string,
  companyName: string,
  verificationUrl: string
) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Einladung zur Unternehmensregistrierung";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Willkommen bei FahrzeugManager Pro!</h2>
      <p>Sehr geehrte Damen und Herren von ${companyName},</p>
      <p>Sie wurden eingeladen, Ihr Unternehmen bei FahrzeugManager Pro zu registrieren.</p>
      <p>Um die Registrierung abzuschließen, klicken Sie bitte auf den folgenden Button:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; 
                text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Registrierung bestätigen
      </a>
      <p>Dieser Link ist 24 Stunden gültig.</p>
      <div style="margin-top: 40px; font-size: 12px; color: #666;">
        <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.</p>
      </div>
    </div>
  `;
  sendSmtpEmail.sender = { name: "FahrzeugManager Pro", email: "viktor@vilonda.de" };
  sendSmtpEmail.to = [{ email }];

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendCompanyInvitationReminder = async (
  email: string,
  companyName: string,
  verificationUrl: string
) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Erinnerung: Unternehmensregistrierung";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Erinnerung: Registrierung bei FahrzeugManager Pro</h2>
      <p>Sehr geehrte Damen und Herren von ${companyName},</p>
      <p>Sie wurden kürzlich eingeladen, Ihr Unternehmen bei FahrzeugManager Pro zu registrieren.</p>
      <p>Falls Sie die Registrierung noch nicht abgeschlossen haben, können Sie dies über den folgenden Button nachholen:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; 
                text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Registrierung jetzt abschließen
      </a>
      <p>Dieser Link ist 24 Stunden gültig.</p>
      <div style="margin-top: 40px; font-size: 12px; color: #666;">
        <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.</p>
      </div>
    </div>
  `;
  sendSmtpEmail.sender = { name: "FahrzeugManager Pro", email: "viktor@vilonda.de" };
  sendSmtpEmail.to = [{ email }];

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
};