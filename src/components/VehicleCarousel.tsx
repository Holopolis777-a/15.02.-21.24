import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import VehicleCard from '../pages/vehicles/components/VehicleCard';

interface VehicleCarouselProps {
  vehicles: Vehicle[];
}

export const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ vehicles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + vehicles.length) % vehicles.length);
  };

  if (!vehicles.length) return null;

  return (
    <div className="relative group px-4 py-8">
      <div className="overflow-hidden">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-transform duration-500 ease-out"
        >
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="transform transition-transform duration-500 hover:scale-[1.02]"
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default VehicleCarousel;
