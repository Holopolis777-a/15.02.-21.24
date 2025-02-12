import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { storage } from '../../../../lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string) => void;
  maxSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onUpload,
  maxSize = 2 // Default max size is 2MB
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Das Bild darf maximal ${maxSize}MB groß sein`);
      return false;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Nur JPG, PNG und WebP Dateien sind erlaubt');
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Create a unique filename
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `news/${filename}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef);
      onUpload(downloadUrl);
      setUploadProgress(100);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Fehler beim Hochladen des Bildes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    onUpload('');
    setUploadProgress(0);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Bild
      </label>

      {currentImage ? (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt="Vorschau"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isLoading 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          <div className="text-center">
            {isLoading ? (
              <div className="space-y-3">
                <div className="animate-spin mx-auto">
                  <Upload className="w-12 h-12 text-blue-500" />
                </div>
                <div className="text-sm text-gray-500">
                  Upload läuft... {uploadProgress}%
                </div>
              </div>
            ) : (
              <>
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Bild auswählen oder hierher ziehen
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      disabled={isLoading}
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, WebP bis zu {maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;