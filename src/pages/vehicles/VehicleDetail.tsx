import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useVehicleRequests } from '../../hooks/useVehicleRequests';
import { useBrokerData } from '../../hooks/useBrokerData';
import { Pencil, Trash2 } from 'lucide-react';
import { useVehicleDetail } from '../../hooks/useVehicleDetail';
import VehicleGallery from './components/detail/VehicleGallery';
import VehicleInfo from './components/detail/VehicleInfo';
import VehicleConfiguration from './components/detail/VehicleConfiguration';
import VehicleServices from './components/detail/VehicleServices';
import VehicleCosts, { getMonthlyRate } from './components/detail/VehicleCosts';
import SalaryConversionCalculator from './components/detail/SalaryConversionCalculator';
import VehicleRequestConfirmationDialog from '../../components/VehicleRequestConfirmationDialog';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicle, isLoading: isVehicleLoading, error, deleteVehicle } = useVehicleDetail(id);
  const { submitRequest } = useVehicleRequests();
  const { user, isLoading: isAuthLoading } = useAuthStore(state => ({
    user: state.user,
    isLoading: state.isLoading
  }));
  const { brokerData } = useBrokerData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<{
    duration: number;
    mileage: number;
    colorId?: string;
  }>({
    duration: 36,
    mileage: 10000
  });
  
  const [salaryConfig, setSalaryConfig] = useState<{
    grossSalary: number;
    taxClass: string;
    churchTax: string;
    powerCosts: string;
    distance: number;
    monthlyRate: number;
    effectiveCost: number;
  } | null>(null);

  // Reset salary config when vehicle or config changes
  useEffect(() => {
    if (vehicle?.categories?.includes('salary')) {
      setSalaryConfig(null);
    }
  }, [vehicle, selectedConfig]);

  const handleRequestClick = () => {
    setShowConfirmationDialog(true);
  };

  const handleRequestConfirm = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    if (!vehicle) {
      console.error('No vehicle data found');
      return;
    }

    // Only check for companyId if user is an employer or employee
    if (['employer', 'employee_normal', 'employee_salary'].includes(user.role) && !user.companyId) {
      console.error('User has no company ID');
      return;
    }

    const isSalaryConversion = vehicle.categories?.includes('salary') ?? false;
    if (isSalaryConversion && !salaryConfig) {
      console.error('Missing salary configuration for salary conversion request');
      return;
    }

    // Get the companyId and company data based on user role
    let requestCompanyId: string;
    let companyData: any = null;
    
    if (user.role === 'admin') {
      requestCompanyId = 'system'; // Placeholder companyId for admin
    } else if (user.role === 'broker') {
      // For brokers, use their ID as the companyId and their broker data
      requestCompanyId = user.id;
      if (brokerData) {
        companyData = {
          name: brokerData.companyName,
          contactPerson: brokerData.fullName,
          email: brokerData.email,
          phone: brokerData.phone,
          address: brokerData.address
        };
      } else {
        setSubmitError('Fehlende Unternehmensdaten');
        return;
      }
    } else if (user.role === 'customer') {
      // For customers, use their ID as the requestCompanyId
      requestCompanyId = user.id;
    } else if (user.companyId) {
      // For employees and employers
      requestCompanyId = user.companyId;
    } else {
      setSubmitError('Fehlende Unternehmensdaten');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      console.log('Creating vehicle request:', {
        userId: user.id,
        companyId: requestCompanyId,
        vehicleId: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        isSalaryConversion,
        type: isSalaryConversion ? 'salary_conversion' : 'regular'
      });

      await submitRequest({
        userId: user.id,
        companyId: requestCompanyId,
        vehicleId: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        trimLevel: vehicle.trimLevel,
        color: vehicle.customColors?.find(c => c.id === selectedConfig.colorId)?.name || vehicle.color || '',
        duration: selectedConfig.duration,
        mileagePerYear: selectedConfig.mileage,
        vehicleImage: vehicle.images?.[0] || undefined,
        monthlyRate: isSalaryConversion 
          ? salaryConfig?.monthlyRate || 0
          : getMonthlyRate(vehicle, selectedConfig),
        type: isSalaryConversion ? 'salary_conversion' : 'regular',
        category: vehicle.category === 'company' || vehicle.categories?.includes('company') ? 'company' : 'private',
        isOrder: !isSalaryConversion, // Nur für normale Anfragen als Bestellung markieren
        status: isSalaryConversion ? 'pending' : 'credit_check_started',
        ...(isSalaryConversion && salaryConfig ? {
          salaryConversion: {
            grossSalary: salaryConfig.grossSalary,
            taxClass: salaryConfig.taxClass,
            churchTax: salaryConfig.churchTax,
            powerCosts: salaryConfig.powerCosts,
            distance: salaryConfig.distance,
            effectiveCost: salaryConfig.effectiveCost,
            listPrice: vehicle.listPrice || vehicle.basePrice
          }
        } : {}),
        ...(user.role === 'broker' && companyData ? {
          company: companyData
        } : {})
      });
      
      // Für Gehaltsumwandlungsanfragen zur Anfragen-Seite navigieren
      if (isSalaryConversion) {
        navigate('/requests');
      } else {
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error submitting vehicle request:', error);
      setSubmitError(error instanceof Error ? error.message : 'Fehler beim Senden der Anfrage');
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await deleteVehicle(id);
      navigate('/vehicles');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const isAdmin = useAuthStore.getState().user?.role === 'admin';
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isVehicleLoading || isAuthLoading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Only employers and employees need companyId
  if (['employer', 'employee_normal', 'employee_salary'].includes(user.role) && !user.companyId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
        <h3 className="text-lg font-medium mb-2">Fehlende Unternehmensdaten</h3>
        <p>Bitte vervollständigen Sie Ihre Unternehmensdaten, um Fahrzeuganfragen stellen zu können.</p>
      </div>
    );
  }

  // For customers, check if profile is complete
  if (user.role === 'customer' && !user.isProfileComplete) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
        <h3 className="text-lg font-medium mb-2">Profil unvollständig</h3>
        <p>Bitte vervollständigen Sie Ihre persönlichen Daten, um Fahrzeuganfragen stellen zu können.</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error || 'Fahrzeug nicht gefunden'}
      </div>
    );
  }

  const isSalaryConversion = vehicle.categories?.includes('salary') ?? false;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Vehicle Title */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h1>
              {vehicle.trimLevel && (
                <p className="mt-2 text-lg text-gray-600">{vehicle.trimLevel}</p>
              )}
            </div>
            {isAdmin && (
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate(`/vehicles/${id}`)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Bearbeiten
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Löschen
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <VehicleGallery images={vehicle.images || []} />
              <VehicleInfo vehicle={vehicle} />
              <VehicleServices services={vehicle.includedServices || []} />
            </div>

            {/* Right Column - Sticky */}
            <div className="lg:sticky lg:top-8 space-y-8">
              <VehicleConfiguration
                vehicle={vehicle}
                selectedConfig={selectedConfig}
                onChange={setSelectedConfig}
              />
              
              <div className="space-y-4">
                {isSalaryConversion ? (
                  <SalaryConversionCalculator
                    vehicle={vehicle}
                    selectedConfig={selectedConfig}
                    onConfigChange={setSalaryConfig}
                  />
                ) : (
                  <VehicleCosts
                    vehicle={vehicle}
                    config={selectedConfig}
                    oneTimeCosts={vehicle.oneTimeCosts || []}
                  />
                )}
                <div className="space-y-2">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm">
                      {submitError}
                    </div>
                  )}
                  <>
                    {(user?.role === 'employee_normal' || user?.role === 'employee_salary') && !user?.isProfileComplete ? (
                      <button
                        disabled
                        className="w-full py-4 px-6 bg-gray-400 text-white rounded-lg font-medium text-lg cursor-not-allowed"
                      >
                        Bitte erst oben Daten vervollständigen
                      </button>
                    ) : (
                      <button
                        onClick={handleRequestClick}
                        disabled={isSubmitting || isAuthLoading || (user.role === 'employee_normal' && !user?.companyId) || (isSalaryConversion && !salaryConfig)}
                        className={`w-full py-4 px-6 ${
                          isSubmitting || isAuthLoading || (user.role === 'employee_normal' && !user?.companyId) || (isSalaryConversion && !salaryConfig)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2`}
                      >
                        <span>
                          {isSubmitting 
                            ? 'Wird gesendet...' 
                            : isSalaryConversion 
                              ? 'Gehaltsumwandlung anfragen'
                              : 'Jetzt verbindlich Bestellen'
                          }
                        </span>
                      </button>
                    )}
                    <VehicleRequestConfirmationDialog
                      isOpen={showConfirmationDialog}
                      onClose={() => setShowConfirmationDialog(false)}
                      onConfirm={handleRequestConfirm}
                      isSubmitting={isSubmitting}
                      isSalaryConversion={isSalaryConversion}
                    />
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Fahrzeug löschen
            </h3>
            <p className="text-gray-500 mb-6">
              Sind Sie sicher, dass Sie dieses Fahrzeug löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Wird gelöscht...' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleDetail;
