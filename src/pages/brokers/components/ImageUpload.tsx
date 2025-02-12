import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
  maxSize?: number; // in MB
  accept?: string;
}

interface UploadState {
  isUploading: boolean;
  error: string | null;
  success: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxSize = 2,
  accept = 'image/*'
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
    success: false
  });

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      setUploadState(prev => ({
        ...prev,
        error: `Die Datei ist zu groß. Maximale Größe ist ${maxSize}MB.`,
        success: false
      }));
      return false;
    }

    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setUploadState(prev => ({
        ...prev,
        error: 'Nur JPG und PNG Dateien sind erlaubt.',
        success: false
      }));
      return false;
    }

    return true;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setUploadState({ isUploading: true, error: null, success: false });
      
      // Convert to base64
      const base64Data = await convertToBase64(file);
      
      // Call onUpload with base64 data
      await onUpload(base64Data);
      
      setUploadState({ isUploading: false, error: null, success: true });
    } catch (err) {
      console.error('Error processing logo:', err);
      setUploadState({
        isUploading: false,
        error: err instanceof Error ? err.message : 'Fehler beim Verarbeiten des Logos',
        success: false
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      {uploadState.error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {uploadState.error}
        </div>
      )}

      {uploadState.success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
          Logo erfolgreich hochgeladen
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors"
      >
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <span>Logo hochladen</span>
              <input
                type="file"
                className="sr-only"
                accept={accept}
                onChange={handleChange}
                disabled={uploadState.isUploading}
              />
            </label>
            <p className="pl-1">oder hierher ziehen</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG bis zu {maxSize}MB
          </p>
        </div>

        {uploadState.isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
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

export default ImageUpload;
