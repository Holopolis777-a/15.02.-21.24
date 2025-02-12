import React, { useState } from 'react';
import { Vehicle } from '../../../../types/vehicle';
import ImageUpload from './ImageUpload';
import ImageGrid from './ImageGrid';

interface ImagesSectionProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({ data, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      // Convert files to base64 strings
      const base64Promises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to convert file to base64'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(base64Promises);
      onChange({
        ...data,
        images: [...(data.images || []), ...base64Images]
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...(data.images || [])];
    newImages.splice(index, 1);
    onChange({ ...data, images: newImages });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fahrzeugbilder</h3>
        <ImageUpload onUpload={handleUpload} disabled={isUploading} />
        {isUploading && (
          <div className="mt-2 text-sm text-gray-500">
            Bilder werden hochgeladen...
          </div>
        )}
        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {data.images && data.images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Hochgeladene Bilder</h4>
          <ImageGrid images={data.images} onRemove={handleRemove} />
        </div>
      )}
    </div>
  );
};

export default ImagesSection;
