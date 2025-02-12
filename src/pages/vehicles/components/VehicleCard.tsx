import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { 
  Pencil, 
  Trash2,
  Battery,
  Zap,
  Gauge,
  Car as CarIcon,
  Eye,
  Copy
} from 'lucide-react';
import { Vehicle } from '../../../types/vehicle';
import DeleteConfirmationDialog from '../../../components/DeleteConfirmationDialog';
import { useVehicles } from '../../../hooks/useVehicles';
import { getLowestMonthlyRate } from '../../../utils/priceUtils';
import { getFuelTypeColors } from '../../../utils/fuelTypeColors';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const { deleteVehicle, duplicateVehicle } = useVehicles();
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin';
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDuplicate = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      setIsDuplicating(true);
      const newId = await duplicateVehicle(vehicle);
      navigate(`/vehicles/${newId}`);
    } catch (error) {
      console.error('Error duplicating vehicle:', error);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteVehicle(vehicle.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isElectric = vehicle.fuelType === 'Elektro';
  const isSalaryConversion = vehicle.categories?.includes('salary');
  const colors = getFuelTypeColors(vehicle.fuelType || '');

  const priceInfo = {
    amount: isSalaryConversion 
      ? (vehicle.salaryConversionPrice || 0) 
      : getLowestMonthlyRate(vehicle.priceMatrix),
    label: '/Monat'
  };

  return (
    <>
      <div 
        onClick={() => navigate(`/vehicles/${vehicle.id}/detail`)}
        className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1" 
        style={{ maxWidth: '380px' }}
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

          {/* Deal Badge */}
          {vehicle.promotionText && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                {vehicle.promotionText}
              </span>
            </div>
          )}

          {/* Range Badge */}
          {isElectric && vehicle.range && (
            <div className="absolute top-4 right-4">
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
            {/* Vehicle Name and Trim */}
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
                {isElectric ? (
                  <>
                    <Zap className="w-4 h-4" style={{ color: colors.border }} />
                    <span className="font-medium" style={{ color: colors.text }}>Elektro</span>
                  </>
                ) : (
                  <>
                    <Gauge className="w-4 h-4" style={{ color: colors.border }} />
                    <span className="font-medium" style={{ color: colors.text }}>{vehicle.fuelType}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100">
                <span className="font-medium text-gray-700">{vehicle.power} PS</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100">
                <span className="font-medium text-gray-700">{vehicle.transmission}</span>
              </div>
            </div>

            {/* Price and Availability */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-end">
                  <div className="text-sm font-medium px-3 py-1 rounded-lg" style={{ 
                    backgroundColor: vehicle.isAvailable ? '#dcfce7' : '#fef9c3',
                    color: vehicle.isAvailable ? '#166534' : '#854d0e'
                  }}>
                    {vehicle.isAvailable 
                      ? 'Sofort verfügbar' 
                      : `Lieferzeit: ${vehicle.deliveryTime} Monate`}
                  </div>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-sm text-gray-500 font-medium">ab</span>
                  <div className="text-2xl font-bold text-gray-900 ml-2">
                    {priceInfo.amount?.toLocaleString('de-DE')} €
                    {isSalaryConversion ? '*' : ''}
                  </div>
                  <span className="text-sm font-medium text-gray-500 ml-1">{priceInfo.label}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={handleDuplicate}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    style={{ color: colors.border }}
                    title="Duplizieren"
                    disabled={isDuplicating}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/vehicles/${vehicle.id}`);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    style={{ color: colors.border }}
                    title="Bearbeiten"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Fahrzeug löschen"
        message="Sind Sie sicher, dass Sie dieses Fahrzeug löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        isDeleting={isDeleting}
      />
    </>
  );
};

export default VehicleCard;
