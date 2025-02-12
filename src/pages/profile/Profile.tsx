import React, { useEffect, useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileForm from './components/ProfileForm';
import LogoUpload from '../../components/profile/LogoUpload';
import { useAuthStore } from '../../store/authStore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

const Profile = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [logoUrl, setLogoUrl] = useState<string | undefined>(user?.logoUrl);

  // Fetch latest user data to ensure we have the current logo URL
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        const userData = userDoc.data();
        if (userData) {
          // Update logo URL even if it's undefined
          setLogoUrl(userData.logoUrl);
          console.log('Fetched user data:', { 
            logoUrl: userData.logoUrl,
            userId: user.id 
          });
        }
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleLogoChange = (newLogoUrl: string | undefined) => {
    setLogoUrl(newLogoUrl);
    console.log('Logo updated:', { newLogoUrl, userId: user?.id });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <ProfileHeader user={user} />
      
      {isAdmin && (
        <div className="mb-8">
          <LogoUpload 
            currentLogo={logoUrl}
            onLogoChange={handleLogoChange}
          />
        </div>
      )}
      
      <ProfileForm user={user} />
    </div>
  );
};

export default Profile;
