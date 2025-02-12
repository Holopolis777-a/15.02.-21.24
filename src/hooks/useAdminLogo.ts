import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

export const useAdminLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoRef = doc(db, 'settings', 'logo');
        const logoDoc = await getDoc(logoRef);
        if (logoDoc.exists()) {
          setLogoUrl(logoDoc.data().base64);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  return logoUrl;
};
