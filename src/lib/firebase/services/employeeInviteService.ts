import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config';
import { sendEmployeeInvitationEmail } from '../../email/employeeEmails';
import { v4 as uuidv4 } from 'uuid';

interface EmployeeInviteData {
  email: string;
  companyId: string;
  portalType: 'normal' | 'salary';
  status: 'pending' | 'accepted' | 'declined' | 'active' | 'rejected';
  createdAt: Date;
  invitedBy: string;
  type: 'employee_invite';
  method: 'link' | 'email';
  inviteType: 'employer' | 'employee';
  employerCompanyId: string;
  role: 'employee_normal' | 'employee_salary';
}

export const inviteEmployee = async (
  email: string,
  companyId: string,
  portalType: 'normal' | 'salary',
  userId: string
) => {
  try {
    const isLinkInvite = !email;

    // Only check for existing invites if this is an email-based invite
    if (!isLinkInvite) {
      const existingInvitesQuery = query(
        collection(db, 'employeeInvites'),
        where('email', '==', email),
        where('companyId', '==', companyId),
        where('portalType', '==', portalType),
        where('status', '==', 'pending')
      );

      const existingInvitesSnapshot = await getDocs(existingInvitesQuery);
      
      if (!existingInvitesSnapshot.empty) {
        console.log('[DEBUG] Existing pending invite found for email:', email);
        return {
          success: false,
          error: 'Ein Mitarbeiter mit dieser E-Mail-Adresse wurde bereits eingeladen.'
        };
      }
    }

    // Generate a unique ID for the invite
    const inviteId = uuidv4();

    // Create the employee invite document with all required fields
    const inviteData: EmployeeInviteData = {
      email: email || '', // Empty string for link invites
      companyId,
      employerCompanyId: companyId,
      portalType,
      status: 'active',
      createdAt: new Date(),
      invitedBy: userId,
      type: 'employee_invite',
      inviteType: 'employer',
      method: isLinkInvite ? 'link' : 'email',
      role: portalType === 'salary' ? 'employee_salary' : 'employee_normal'
    };

    console.log('[DEBUG] Invite Employee - Invite Data:', JSON.stringify(inviteData, null, 2));

    // Create the document with the generated ID
    await setDoc(doc(db, 'employeeInvites', inviteId), inviteData);

    // Only send email if this is an email-based invite
    if (!isLinkInvite) {
      console.log(`[DEBUG] Sending invitation email with portal type: ${portalType}`);
      await sendEmployeeInvitationEmail(email, inviteId, portalType);
      console.log('[DEBUG] Invite Employee - Email Sent Successfully');
    }

    return {
      success: true,
      inviteId: inviteId,
    };
  } catch (error) {
    console.error('Error inviting employee:', error);
    console.log('[DEBUG] Invite Employee - Full Error:', JSON.stringify(error, null, 2));
    throw error;
  }
};
