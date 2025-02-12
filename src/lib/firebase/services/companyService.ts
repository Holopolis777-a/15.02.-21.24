import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config';
import { Company } from '../../../types/company';

export const updateCompanyData = async (companyId: string, data: Partial<Company>) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(companyRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating company data:', error);
    return { success: false, error };
  }
};
