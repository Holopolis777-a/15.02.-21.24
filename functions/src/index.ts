import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { rateLimit } from 'firebase-functions-rate-limiter';

admin.initializeApp();

// Rate limiter setup
const limiter = rateLimit({
  maxCalls: 5, // Max 5 invites per timeWindow
  timeWindow: 60 * 60 * 1000, // 1 hour in milliseconds
  keyPrefix: 'company-invite',
  keyGenerator: (req) => req.ip || 'anonymous'
});

// Email configuration
const transporter = nodemailer.createTransport({
  // Configure your email service here
  // For example, using Gmail:
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

// Company invitation email template
const getEmailTemplate = (companyName: string, verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #2563eb; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer { margin-top: 40px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Willkommen bei FahrzeugManager Pro!</h2>
    <p>Sehr geehrte Damen und Herren von ${companyName},</p>
    <p>Sie wurden eingeladen, Ihr Unternehmen bei FahrzeugManager Pro zu registrieren.</p>
    <p>Um die Registrierung abzuschließen, klicken Sie bitte auf den folgenden Button:</p>
    <a href="${verificationUrl}" class="button">Registrierung bestätigen</a>
    <p>Dieser Link ist 24 Stunden gültig.</p>
    <div class="footer">
      <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.</p>
    </div>
  </div>
</body>
</html>
`;

// Send company invitation email
export const sendCompanyInvitation = functions.firestore
  .document('verifications/{verificationId}')
  .onCreate(async (snap, context) => {
    const verification = snap.data();
    const verificationId = context.params.verificationId;

    try {
      // Apply rate limiting
      await limiter.rejectOnQuotaExceededOrRecordUsage();

      const verificationUrl = `${functions.config().app.url}/verify/${verificationId}`;
      
      const mailOptions = {
        from: `"FahrzeugManager Pro" <${functions.config().email.user}>`,
        to: verification.email,
        subject: 'Einladung zur Unternehmensregistrierung',
        html: getEmailTemplate(verification.companyData.name, verificationUrl)
      };

      await transporter.sendMail(mailOptions);

      // Update verification document with sent status
      await admin.firestore()
        .collection('verifications')
        .doc(verificationId)
        .update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (error) {
      console.error('Error sending invitation:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send invitation email');
    }
  });

// Clean up expired verifications
export const cleanupExpiredVerifications = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    
    const snapshot = await admin.firestore()
      .collection('verifications')
      .where('expiresAt', '<', now)
      .where('verified', '==', false)
      .get();

    const batch = admin.firestore().batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  });