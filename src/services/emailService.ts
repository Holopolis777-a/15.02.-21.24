import * as SibApiV3Sdk from 'sib-api-v3-sdk';

// Initialize Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Template IDs
const TEMPLATES = {
  BROKER_WELCOME: 7
};

interface BrokerWelcomeEmailParams {
  email: string;
  name: string;
  password: string;
  loginUrl: string;
}

export const sendBrokerWelcomeEmail = async (params: BrokerWelcomeEmailParams) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    // Use template ID 7
    sendSmtpEmail.templateId = TEMPLATES.BROKER_WELCOME;
    
    // Set template parameters
    sendSmtpEmail.params = {
      name: params.name,
      email: params.email,
      password: params.password,
      loginUrl: params.loginUrl
    };

    sendSmtpEmail.to = [{ email: params.email }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error('Error sending broker welcome email:', error);
    throw error;
  }
};