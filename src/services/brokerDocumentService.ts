import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { BrokerInviteFormData } from '../types/broker';

export const createBrokerDocument = async (userId: string, data: BrokerInviteFormData): Promise<string> => {
  const brokerRef = await addDoc(collection(db, 'brokers'), {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    companyName: data.companyName.trim(),
    address: {
      street: data.address.street.trim(),
      city: data.address.city.trim(),
      postalCode: data.address.postalCode.trim()
    },
    userId,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return brokerRef.id;
};