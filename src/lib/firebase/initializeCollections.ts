import { collection, getDocs, query, limit, setDoc, doc } from 'firebase/firestore';
import { db } from './config';
import { getAuth } from 'firebase/auth';

export const initializeCollections = async () => {
  try {
    const auth = getAuth();
    if (!auth.currentUser) {
      // Skip initialization if user is not authenticated
      return;
    }

    // Initialize FAQs collection
    const faqsRef = collection(db, 'faqs');
    const faqsQuery = query(faqsRef, limit(1));
    const faqsSnapshot = await getDocs(faqsQuery);

    if (faqsSnapshot.empty) {
      const initialFAQ = {
        title: 'Willkommen bei FahrzeugManager Pro',
        content: '<p>Dies ist ein Beispiel-FAQ-Eintrag.</p>',
        targets: ['customer'],
        priority: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
      };

      await setDoc(doc(faqsRef), initialFAQ);
    }

    // Initialize vehicles collection
    const vehiclesRef = collection(db, 'vehicles');
    const vehiclesQuery = query(vehiclesRef, limit(1));
    const vehiclesSnapshot = await getDocs(vehiclesQuery);

    if (vehiclesSnapshot.empty) {
      const initialVehicle = {
        brand: 'Demo',
        model: 'Fahrzeug',
        year: new Date().getFullYear(),
        type: 'regular',
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
      };

      await setDoc(doc(vehiclesRef), initialVehicle);
    }
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};