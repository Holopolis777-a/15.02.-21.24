import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (files: FileList) => void;
  maxSize?: number; // in MB
  accept?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  maxSize = 5, // Default max size is 5MB
  accept = 'image/jpeg,image/png',
  disabled = false
}) => {
  const validateAndResizeImage = async (file: File): Promise<File | null> => {
    // Check file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert(`Datei "${file.name}" hat ein ungültiges Format. Erlaubt sind nur JPG und PNG.`);
      return null;
    }

    // Create image element to get dimensions
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      const maxDimension = 800; // Max width or height
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw resized image
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        // Preserve original format for PNGs to maintain transparency
        const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'image/png' ? 1 : 0.8;
        canvas.toBlob(resolve, format, quality);
      });

      if (!blob) return null;

      // Create new file from blob
      return new File([blob], file.name, {
        type: file.type // Preserve original file type
      });

    } catch (error) {
      console.error('Error resizing image:', error);
      return null;
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const validateFiles = async (files: FileList): Promise<FileList | null> => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const resizedFile = await validateAndResizeImage(files[i]);
      if (resizedFile) {
        validFiles.push(resizedFile);
      }
    }
    
    if (validFiles.length === 0) {
      return null;
    }

    // Convert array to FileList
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      const validatedFiles = await validateFiles(e.dataTransfer.files);
      if (validatedFiles) {
        onUpload(validatedFiles);
      }
    }
  }, [onUpload, disabled]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && e.target.files) {
      const validatedFiles = await validateFiles(e.target.files);
      if (validatedFiles) {
        onUpload(validatedFiles);
      }
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        disabled 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
          : 'border-gray-300 hover:border-blue-500 cursor-pointer'
      }`}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <div className="mt-4">
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="mt-2 block text-sm font-medium text-gray-700">
            Dateien hierher ziehen oder klicken zum Auswählen
          </span>
          <input
            id="file-upload"
            type="file"
            className="hidden" 
            disabled={disabled}
            multiple
            accept={accept}
            onChange={handleChange}
          />
        </label>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG bis zu {maxSize}MB (Bilder werden automatisch optimiert)
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
