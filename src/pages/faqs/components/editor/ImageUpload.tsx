import React, { useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelect: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageSelect }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const validateFile = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Das Bild darf maximal 5MB groß sein');
      return false;
    }

    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine Bilddatei aus');
      return false;
    }

    return true;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Bild
      </label>

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Vorschau"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => onImageSelect(null)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors"
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label className="relative cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">
                  Datei auswählen
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && validateFile(file)) {
                      onImageSelect(file);
                    }
                  }}
                />
              </label>
              <span className="text-gray-500"> oder hierher ziehen</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              PNG, JPG bis zu 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;