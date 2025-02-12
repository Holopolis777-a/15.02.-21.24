import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Vehicle } from '../../../types/vehicle';
import DeleteConfirmationDialog from '../../../components/DeleteConfirmationDialog';
import { useVehicles } from '../../../hooks/useVehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const navigate = useNavigate();
  const { deleteVehicle } = useVehicles();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    // Ensure we're using the correct ID from the database
    if (vehicle.id) {
      navigate(`/vehicles/${vehicle.id}`);
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* ... rest of the card content ... */}
        
        <div className="flex justify-end space-x-2 pt-2 border-t">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Bearbeiten"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            title="Löschen"
          >
            <Trash2 className="w-5 h-5" />
          </button>
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