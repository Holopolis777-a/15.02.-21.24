import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleGalleryProps {
  images: string[];
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Keine Bilder verfügbar</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Fahrzeugbild ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`aspect-[4/3] rounded-lg overflow-hidden border-2 ${
              index === currentIndex ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehicleGallery;