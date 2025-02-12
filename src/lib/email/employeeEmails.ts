import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { db } from '../firebase/config';

// Base URL for employee verification
const EMPLOYEE_VERIFICATION_URL = import.meta.env.VITE_APP_URL + '/verify/employee';

// Initialize Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = import.meta.env.VITE_BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Template IDs from Brevo
const TEMPLATES = {
  EMPLOYEE_REGISTRATION: 13,
  EMPLOYEE_APPROVAL: 14,
  EMPLOYEE_REJECTION: 15,
  EMPLOYEE_INVITATION_NORMAL: 16,
  EMPLOYEE_INVITATION_SALARY: 10
};

export const sendEmployeeInvitationEmail = async (
  email: string,
  inviteId: string,
  portalType: 'normal' | 'salary'
) => {
  try {
    const verificationUrl = `${EMPLOYEE_VERIFICATION_URL}/${inviteId}`;
    const portalName = portalType === 'normal' ? 'Mitarbeiterportal' : 'Gehaltsumwandlungsportal';

    const templateId = portalType === 'normal' ?
      TEMPLATES.EMPLOYEE_INVITATION_NORMAL :
      TEMPLATES.EMPLOYEE_INVITATION_SALARY;
    
    console.log(`Using template ID ${templateId} for portal type: ${portalType}`);
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = templateId;
    sendSmtpEmail.to = [{ email, name: email }];
    
    sendSmtpEmail.params = {
      verificationUrl,
      portalName,
      portalType,
      email
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Employee invitation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending employee invitation email:', error);
    throw error;
  }
};

export const sendRegistrationConfirmationEmail = async (
  email: string,
  firstname: string,
  lastname: string
) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = TEMPLATES.EMPLOYEE_REGISTRATION;
    sendSmtpEmail.to = [{ email, name: `${firstname} ${lastname}` }];
    
    sendSmtpEmail.params = {
      firstname,
      lastname
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Employee registration confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    throw error;
  }
};

export const sendApprovalNotificationEmail = async (
  email: string,
  firstname: string,
  lastname: string,
  approved: boolean,
  portalType: 'normal' | 'salary'
) => {
  try {
    const portalName = portalType === 'normal' ? 'Mitarbeiterportal' : 'Gehaltsumwandlungsportal';
    const loginUrl = portalType === 'normal' 
      ? import.meta.env.VITE_EMPLOYEE_PORTAL_URL 
      : import.meta.env.VITE_SALARY_PORTAL_URL;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = approved ? TEMPLATES.EMPLOYEE_APPROVAL : TEMPLATES.EMPLOYEE_REJECTION;
    sendSmtpEmail.to = [{ email, name: `${firstname} ${lastname}` }];
    
    sendSmtpEmail.params = {
      firstname,
      lastname,
      portalName,
      loginUrl: approved ? loginUrl : undefined
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Employee ${approved ? 'approval' : 'rejection'} email sent:`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending approval notification email:', error);
    throw error;
  }
};
