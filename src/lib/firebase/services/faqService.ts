import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config';
import { FAQ, FAQFormData } from '../../../types/faq';
import { validateFAQData } from '../validators/faqValidator';
import { uploadFAQImage } from '../storage/faqStorage';

export const createFAQ = async (data: FAQFormData, image?: File): Promise<string> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Nicht authentifiziert');
    }

    // Validate data
    validateFAQData(data);

    // Create base FAQ data
    const faqData = {
      title: data.title.trim(),
      content: data.content.trim(),
      targets: data.targets,
      createdBy: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: data.imageUrl || null
    };

    // Upload new image if provided
    if (image) {
      faqData.imageUrl = await uploadFAQImage(image);
    }

    // Create FAQ document
    const docRef = await addDoc(collection(db, 'faqs'), faqData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating FAQ:', error);
    throw error;
  }
};

export const updateFAQ = async (id: string, data: Partial<FAQ>, image?: File): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Nicht authentifiziert');
    }

    // Validate data
    validateFAQData(data as FAQFormData);

    // Prepare update data
    const updateData = {
      title: data.title?.trim(),
      content: data.content?.trim(),
      targets: data.targets,
      updatedAt: new Date().toISOString(),
      imageUrl: data.imageUrl || null
    };

    // Upload new image if provided
    if (image) {
      updateData.imageUrl = await uploadFAQImage(image);
    }

    // Update document
    const docRef = doc(db, 'faqs', id);
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
};