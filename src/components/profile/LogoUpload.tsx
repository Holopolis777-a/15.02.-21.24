import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { doc, updateDoc, getDoc, deleteField, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { fileToBase64, validateImageSize } from '../../utils/fileUpload';
import { useAuthStore } from '../../store/authStore';
import { updateBroker } from '../../services/brokerService';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange?: (newLogoUrl: string | undefined) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ currentLogo, onLogoChange }) => {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Always update preview URL when currentLogo changes
    setPreviewUrl(currentLogo || null);
  }, [currentLogo]);

  // Debug log to check values
  useEffect(() => {
    console.log('LogoUpload state:', { currentLogo, previewUrl, user });
  }, [currentLogo, previewUrl, user]);

  const validateFile = async (file: File): Promise<string | null> => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Nur Bilddateien sind erlaubt');
      return null;
    }

    // Validate file size (1MB limit for Firestore)
    if (file.size > 1 * 1024 * 1024) {
      setError('Die Bilddatei darf nicht größer als 1MB sein');
      return null;
    }

    // Convert to base64
    const base64String = await fileToBase64(file);
    
    // Validate final base64 size
    if (!validateImageSize(base64String)) {
      setError('Die Bilddatei ist zu groß für die Datenbank');
      return null;
    }

    return base64String;
  };

  const handleUpload = async (file: File) => {
    if (!user?.id) {
      setError('Benutzer nicht gefunden');
      return;
    }
    
    try {
      setIsUpdating(true);
      setError(null);

      // Reset messages
      setError(null);
      setSuccess(null);

      // Show preview before upload
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Validate file
      if (!file.type.startsWith('image/')) {
        setError('Nur Bilddateien sind erlaubt');
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        setError('Die Bilddatei darf nicht größer als 1MB sein');
        return;
      }

      // Verify user is admin or broker
      const userDoc = await getDoc(doc(db, 'users', user.id));
      if (!userDoc.exists() || (userDoc.data().role !== 'admin' && userDoc.data().role !== 'broker')) {
        setError('Keine Berechtigung zum Aktualisieren des Logos');
        return;
      }

      // Convert to base64
      const base64String = await fileToBase64(file);
      if (!validateImageSize(base64String)) {
        setError('Die Bilddatei ist zu groß für die Datenbank');
        return;
      }

      // Store base64 string in Firestore
      const logoRef = doc(db, 'settings', 'logo');
      await setDoc(logoRef, {
        base64: base64String,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id
      }, { merge: true });

      // Update local state and show success message
      setUser({ ...user, logoUrl: base64String });
      onLogoChange?.(base64String);
      setSuccess('Logo wurde erfolgreich gespeichert');
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Hochladen des Logos');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsUpdating(true);
      setError(null);

      // Prepare Firestore update
      const userUpdate = {
        logoUrl: deleteField(),
        updatedAt: new Date().toISOString()
      };

      // Delete logo from Firestore
      const logoRef = doc(db, 'settings', 'logo');
      await deleteDoc(logoRef);

      // If user is a broker, also update broker document
      if (user.role === 'broker' && user.brokerId) {
        const brokerUpdate = {
          logoUrl: deleteField()
        };
        await updateBroker(user.brokerId, brokerUpdate as any);
      }

      // Update local state and show success message
      setUser({ ...user, logoUrl: undefined });
      onLogoChange?.(undefined);
      setPreviewUrl(null);
      setSuccess('Logo wurde erfolgreich entfernt');
    } catch (err) {
      console.error('Error removing logo:', err);
      setError('Fehler beim Entfernen des Logos');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user?.role || (user.role !== 'admin' && user.role !== 'broker')) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Logo</h3>
        {currentLogo && (
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Logo entfernen
          </button>
        )}
      </div>

      {(error || success) && (
        <div className={`border-l-4 p-4 ${
          error 
            ? 'bg-red-50 border-red-400 text-red-700' 
            : 'bg-green-50 border-green-400 text-green-700'
        }`}>
          {error || success}
        </div>
      )}

      <div className="relative">
        {currentLogo ? (
          <div className="relative">
            <img
              src={currentLogo}
              alt="Portal Logo"
              className="w-full h-48 object-contain bg-gray-50 rounded-lg"
            />
            <label className="absolute bottom-4 right-4 bg-white rounded-md shadow-lg px-4 py-2 cursor-pointer hover:bg-gray-50">
              <span className="text-sm font-medium text-gray-700">
                {isUpdating ? 'Wird hochgeladen...' : 'Logo ändern'}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleUpload(file);
                    e.target.value = ''; // Reset input
                  }
                }}
                disabled={isUpdating}
              />
            </label>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Logo hochladen</span> oder hierher ziehen
              </p>
              <p className="text-xs text-gray-500">PNG, JPG bis zu 1MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(file);
                  e.target.value = ''; // Reset input
                }
              }}
              disabled={isUpdating}
            />
          </div>
        )}

        {isUpdating && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2" />
              <p className="text-sm text-gray-600">Logo wird hochgeladen...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoUpload;
