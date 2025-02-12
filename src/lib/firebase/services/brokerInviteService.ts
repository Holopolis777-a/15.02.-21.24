import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config';
import { sendBrokerInvitationEmail } from '../../email/brokerEmails';
import { v4 as uuidv4 } from 'uuid';

// Base URL for broker registration
const BROKER_REGISTRATION_URL = import.meta.env.VITE_APP_URL + '/verify/broker';

interface BrokerInviteData {
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  fullName?: string;
  type?: 'regular' | 'sub_broker' | 'supbroker';
}

export const generateBrokerInviteLink = async (): Promise<string> => {
  try {
    // Generate a unique ID for the invite
    const inviteId = uuidv4();

    // Create a verification document
    await setDoc(doc(db, 'verifications', inviteId), {
      type: 'broker_invite',
      createdAt: new Date(),
      method: 'link'
    });

    // Create the invite document
    await setDoc(doc(db, 'brokerInvites', inviteId), {
      status: 'pending',
      createdAt: new Date(),
      method: 'link'
    });

    // Return the formatted invite link
    return `${BROKER_REGISTRATION_URL}/${inviteId}`;
  } catch (error) {
    console.error('Error generating broker invite link:', error);
    throw error;
  }
};

export const inviteBroker = async (
  email: string,
  fullName?: string,
  type: 'regular' | 'sub_broker' | 'supbroker' = 'regular'
): Promise<{ success: boolean; inviteId: string }> => {
  try {
    const inviteData: BrokerInviteData = {
      email,
      status: 'pending',
      createdAt: new Date(),
      fullName,
      type
    };

    // Get current user ID for createdBy field
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Create the broker invite
    const docRef = await addDoc(collection(db, 'brokerInvites'), {
      ...inviteData,
      createdBy: currentUser.uid,
      inviteType: type
    });

    // Create a verification document
    await setDoc(doc(db, 'verifications', docRef.id), {
      type: 'broker_invite',
      email,
      fullName,
      createdAt: new Date(),
      createdBy: currentUser.uid,
      inviteType: type
    });

    return {
      success: true,
      inviteId: docRef.id,
    };
  } catch (error) {
    console.error('Error inviting broker:', error);
    throw error;
  }
};
