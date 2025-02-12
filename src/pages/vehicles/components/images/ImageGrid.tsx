import React from 'react';
import { X } from 'lucide-react';

interface ImageGridProps {
  images: string[];
  onRemove: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemove }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <div className="w-full h-48 rounded-lg bg-[repeating-conic-gradient(#FFFFFF_0_90deg,#E5E7EB_90deg_180deg)_0_0/20px_20px]">
            <img
              src={image}
              alt={`Fahrzeugbild ${index + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
