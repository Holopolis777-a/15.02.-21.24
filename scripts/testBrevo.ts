import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const sendTestEmail = async () => {
  const apiKey = process.env.VITE_BREVO_API_KEY;
  
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "FahrzeugManager Pro",
          email: "viktor@vilonda.de"
        },
        to: [{
          email: "viktorledin6@gmail.com",
          name: "Viktor Ledin"
        }],
        subject: "Bestätigen Sie Ihre E-Mail-Adresse",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Willkommen bei FahrzeugManager Pro!</h2>
            <p>Sehr geehrter Viktor Ledin,</p>
            <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, um die Registrierung abzuschließen.</p>
            <p>Klicken Sie auf den folgenden Button:</p>
            <a href="https://portal.vilocar.de/verify-email?email=viktorledin6@gmail.com" 
               style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; 
                      text-decoration: none; border-radius: 6px; margin: 20px 0;">
              E-Mail bestätigen
            </a>
            <div style="margin-top: 40px; font-size: 12px; color: #666;">
              <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.</p>
            </div>
          </div>
        `
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Test email sent successfully:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error sending test email:', error.response?.data || error.message);
    } else {
      console.error('Error sending test email:', error);
    }
  }
};

sendTestEmail();
