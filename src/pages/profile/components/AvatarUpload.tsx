import React, { useState } from 'react';
import { User } from '../../../types/auth';
import { Upload, User as UserIcon } from 'lucide-react';
import { storage } from '../../../lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDocument } from '../../../lib/firebase/db';
import { useAuthStore } from '../../../store/authStore';

interface AvatarUploadProps {
  user: User | null;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ user }) => {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setError(null);

    try {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Das Bild darf maximal 5MB groß sein');
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Nur JPG und PNG Dateien sind erlaubt');
      }

      setIsLoading(true);

      // Create a reference to the file location
      const avatarRef = ref(storage, `avatars/${user.id}`);
      
      // Upload file
      await uploadBytes(avatarRef, file);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(avatarRef);

      // Update user document
      await updateDocument('users', user.id, {
        avatarUrl: downloadUrl
      });

      // Update local state
      setUser({ ...user, avatarUrl: downloadUrl });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Hochladen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <label 
          className={`absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
        >
          <Upload className={`w-4 h-4 ${isLoading ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleUpload}
            disabled={isLoading}
          />
        </label>
      </div>
      <div>
        <p className="text-sm text-gray-600">Erlaubte Dateitypen: JPG, PNG</p>
        <p className="text-sm text-gray-600">Maximale Größe: 5MB</p>
        {error && (
          <p className="text-sm text-red-600 mt-1 font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;