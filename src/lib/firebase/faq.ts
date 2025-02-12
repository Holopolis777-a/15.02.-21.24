import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './config';
import { FAQ, FAQFormData } from '../../types/faq';
import { validateFAQData } from './validators/faqValidator';

export const createFAQ = async (data: FAQFormData, image?: File): Promise<string> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Nicht authentifiziert');
    }

    // Validate data
    validateFAQData(data);

    let imageUrl;
    if (image) {
      const storageRef = ref(storage, `faqs/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Create FAQ document
    const docRef = await addDoc(collection(db, 'faqs'), {
      title: data.title.trim(),
      content: data.content.trim(),
      imageUrl,
      targets: data.targets,
      createdBy: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

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

    let imageUrl = data.imageUrl;
    if (image) {
      const storageRef = ref(storage, `faqs/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    const updateData = {
      title: data.title?.trim(),
      content: data.content?.trim(),
      imageUrl,
      targets: data.targets,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(doc(db, 'faqs', id), updateData);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
};

export const getFAQsByTarget = async (target: string): Promise<FAQ[]> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Nicht authentifiziert');
    }

    const q = query(
      collection(db, 'faqs'),
      where('targets', 'array-contains', target)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FAQ));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const deleteFAQ = async (id: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('Nicht authentifiziert');
    }

    await deleteDoc(doc(db, 'faqs', id));
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    throw error;
  }
};