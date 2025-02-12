import { doc, updateDoc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { BrokerInviteFormData, Broker } from '../types/broker';
import { validateBrokerData } from '../utils/brokerValidation';
import { inviteBroker as sendBrokerInvite } from '../lib/firebase/services/brokerInviteService';
import { sendBrokerInvitationEmail } from '../lib/email/brokerEmails';
import { useAuthStore } from '../store/authStore';

export const inviteBroker = async (data: BrokerInviteFormData & { commissionPerVehicle?: number, type?: 'regular' | 'supbroker' }): Promise<string> => {
  try {
    validateBrokerData(data);
    
    // Get current broker's ID (parent broker)
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      throw new Error('Nicht autorisiert');
    }

    const isAdmin = currentUser.role === 'admin';
    
    // Create broker invite
    const { inviteId } = await sendBrokerInvite(
      data.email,
      data.fullName,
      !isAdmin && data.type !== 'supbroker' ? 'sub_broker' : data.type || 'regular'
    );

    let parentBroker: Broker | null = null;
    
    // Only check parent broker's commission if not an admin and not a supbroker invite
    if (currentUser.role !== 'admin' && data.type !== 'supbroker') {
      const parentBrokerDoc = await getDoc(doc(db, 'brokers', currentUser.email));
      if (!parentBrokerDoc.exists()) {
        throw new Error('Broker nicht gefunden');
      }

      parentBroker = parentBrokerDoc.data() as Broker;
      if (data.commissionPerVehicle && data.commissionPerVehicle > (parentBroker.availableCommission || 0)) {
        throw new Error('Nicht genügend verfügbare Provision');
      }
    }

    // Generate a unique broker ID
    const brokerId = `BR${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

    const commission = data.commissionPerVehicle || 0;

    const brokerDoc: Broker = {
      id: data.email,
      brokerId,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone || '',
      companyName: data.companyName || '',
      address: data.address || {
        street: '',
        city: '',
        postalCode: ''
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      inviteId,
      inviteStatus: 'pending',
      commissionPerVehicle: commission,
      availableCommission: commission,
      originalCommission: commission,
      ...(data.logo ? { logoUrl: data.logo } : {}),
      ...(isAdmin ? {} : { parentBrokerId: currentUser.id }),
      subBrokers: [],
      subBrokerCommissions: {}
    };

    await runTransaction(db, async (transaction) => {
      // Create new broker document
      const brokerRef = doc(db, 'brokers', data.email);
      transaction.set(brokerRef, brokerDoc);
      
      // If not admin and not a supbroker invite, update parent broker's commission and sub-brokers
      if (!isAdmin && parentBroker && data.type !== 'supbroker') {
        const updatedParentBroker = {
          availableCommission: parentBroker.availableCommission - commission,
          subBrokers: [...(parentBroker.subBrokers || []), brokerId],
          subBrokerCommissions: {
            ...(parentBroker.subBrokerCommissions || {}),
            [brokerId]: commission
          }
        };
        
        const parentBrokerRef = doc(db, 'brokers', currentUser.email);
        transaction.update(parentBrokerRef, updatedParentBroker);
      }
    });

    // Send invitation email
    await sendBrokerInvitationEmail(data.email, inviteId, data.fullName);

    return inviteId;
  } catch (error) {
    console.error('Error inviting broker:', error);
    throw error;
  }
};

export const updateBroker = async (brokerEmail: string, data: Partial<Broker>): Promise<void> => {
  try {
    const brokerRef = doc(db, 'brokers', brokerEmail);
    
    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Update broker document
    await updateDoc(brokerRef, updateData);
  } catch (error) {
    console.error('Error updating broker:', error);
    throw new Error('Fehler beim Aktualisieren des Maklers');
  }
};

export const toggleBrokerStatus = async (brokerEmail: string, currentStatus: string) => {
  try {
    const brokerRef = doc(db, 'brokers', brokerEmail);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    await updateDoc(brokerRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });

    return newStatus;
  } catch (error) {
    console.error('Error toggling broker status:', error);
    throw new Error('Fehler beim Ändern des Makler-Status');
  }
};

export const resendBrokerInvitation = async (brokerEmail: string): Promise<void> => {
  try {
    // Get broker data
    const brokerDoc = await getDoc(doc(db, 'brokers', brokerEmail));
    if (!brokerDoc.exists()) {
      throw new Error('Makler nicht gefunden');
    }

    const broker = brokerDoc.data() as Broker;
    
    // Create new invite
    const { inviteId } = await sendBrokerInvite(
      broker.email,
      broker.fullName,
      broker.type || 'regular'
    );

    // Send invitation email
    await sendBrokerInvitationEmail(broker.email, inviteId, broker.fullName);

    // Update broker document using email as ID
    await updateDoc(doc(db, 'brokers', broker.email), {
      lastInviteSentAt: new Date().toISOString(),
      inviteId
    });
  } catch (error) {
    console.error('Error resending broker invitation:', error);
    throw new Error('Fehler beim erneuten Senden der Einladung');
  }
};
