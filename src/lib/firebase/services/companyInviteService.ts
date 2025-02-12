import { addDoc, collection, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../config';
import { CompanyInviteData, Company } from '../../../types/company';
import { validateCompanyData } from '../validators/companyValidator';
import { sendCompanyInvitation } from '../email/companyInvitationEmails';

export const createCompanyInvitation = async (data: CompanyInviteData) => {
  try {
    // Validate data
    validateCompanyData(data);

    // Create company document first
    const companyRef = await addDoc(collection(db, 'companies'), {
      name: data.name,
      legalForm: data.legalForm,
      industry: data.industry,
      contactPerson: data.contactPerson,
      email: data.email.toLowerCase(),
      phone: data.phone,
      employeeCount: parseInt(data.employeeCount),
      address: data.address,
      logoUrl: data.logoUrl || null,
      status: 'pending',
      invitedBy: data.invitedBy, // Add broker's ID
      emailLog: [{
        type: 'invitation',
        sentAt: new Date().toISOString(),
        success: true
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Partial<Company>);

    // Create verification document linked to company
    const verificationRef = await addDoc(collection(db, 'verifications'), {
      type: 'company_invite',
      name: data.name,
      legalForm: data.legalForm,
      industry: data.industry,
      contactPerson: data.contactPerson,
      email: data.email.toLowerCase(),
      phone: data.phone,
      employeeCount: parseInt(data.employeeCount),
      address: data.address,
      role: 'employer',
      createdAt: serverTimestamp(),
      invitedBy: data.invitedBy, // Add broker's ID
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      verified: false,
      verificationStarted: false,
      verificationFailed: false,
      emailSent: false,
      companyId: companyRef.id,
      status: 'pending'
    });

    // Update company with verification ID
    await updateDoc(doc(db, 'companies', companyRef.id), {
      verificationId: verificationRef.id
    });

    // Get broker's company name from users collection
    const brokerDoc = await getDoc(doc(db, 'users', data.invitedBy));
    const brokerName = brokerDoc.data()?.companyName || 'Ein Makler';

    // Send invitation email with verification URL and broker name
    await sendCompanyInvitation({
      email: data.email,
      contactPerson: data.contactPerson,
      companyName: data.name,
      verificationUrl: `${import.meta.env.VITE_APP_URL}/verify/company/${verificationRef.id}`,
      brokerName: brokerName
    });

    return verificationRef.id;
  } catch (error) {
    console.error('Error creating company invitation:', error);
    throw error;
  }
};
