import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../../../types/vehicle';
import { Battery, Zap, Car as CarIcon } from 'lucide-react';
import { getFuelTypeColors } from '../../../utils/fuelTypeColors';

interface SalaryConversionVehicleCardProps {
  vehicle: Vehicle;
}

const SalaryConversionVehicleCard: React.FC<SalaryConversionVehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const isElectric = vehicle.fuelType === 'Elektro';
  const colors = getFuelTypeColors(vehicle.fuelType || '');

  return (
    <div 
      onClick={() => navigate(`/vehicles/${vehicle.id}/detail`)}
      className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1" 
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        {vehicle.images?.[0] ? (
          <img
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <CarIcon className="w-20 h-20" style={{ color: colors.border }} />
          </div>
        )}

        {/* Premium Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white shadow-lg">
            Premium
          </span>
        </div>

        {/* Range Badge */}
        {isElectric && vehicle.range && (
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-3 py-1.5">
              <Battery className="w-4 h-4" style={{ color: colors.border }} />
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                {vehicle.range} km
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Vehicle Name */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.trimLevel && (
              <p className="text-sm text-gray-500 mt-0.5 font-medium">{vehicle.trimLevel}</p>
            )}
          </div>

          {/* Vehicle Specs */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" 
              style={{ backgroundColor: `${colors.border}15` }}
            >
              {isElectric && (
                <>
                  <Zap className="w-4 h-4" style={{ color: colors.border }} />
                  <span className="font-medium" style={{ color: colors.text }}>Elektro</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100">
              <span className="font-medium text-gray-700">{vehicle.power} PS</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                <span className="text-sm text-gray-500 font-medium">ab</span>
                <div className="text-2xl font-bold text-gray-900 ml-2">
                  {(vehicle.salaryConversionPrice || 0).toLocaleString('de-DE')} €*
                </div>
                <span className="text-sm font-medium text-gray-500 ml-1">/Monat</span>
              </div>
              <div className="text-sm font-medium px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                Sofort verfügbar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryConversionVehicleCard;
