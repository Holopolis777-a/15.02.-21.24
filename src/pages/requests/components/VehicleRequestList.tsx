import React, { useState, useEffect } from 'react';
import { VehicleRequestWithCompany, SalaryStatus, OrderStatus } from '../../../types/vehicleRequest';
import { formatDate } from '../../../utils/dateUtils';
import { getDateFromTimestamp } from '../../../utils/firestoreUtils';
import { useAuthStore } from '../../../store/authStore';
import { ChevronDown, Clock, CheckCircle, XCircle, Car, Package, CircleDashed, LucideIcon, Trash2 } from 'lucide-react';
import DeleteConfirmationDialog from '../../../components/DeleteConfirmationDialog';

const SALARY_STATUS_MAP = {
  'pending': 'Ausstehend',
  'approved': 'Genehmigt',
  'rejected': 'Abgelehnt',
  'salary_conversion_approved': 'Gehaltsumwandlung genehmigt',
  'salary_conversion_rejected': 'Gehaltsumwandlung abgelehnt',
  'lease_offer_sent': 'Leasingangebot geschickt',
  'lease_request_submitted': 'Leasinganfrage gestellt',
  'lease_request_approved': 'Leasinganfrage genehmigt',
  'lease_request_rejected': 'Leasinganfrage abgelehnt',
  'in_delivery': 'Lieferung',
  'delivered': 'Geliefert',
  'withdrawn': 'Zurückgezogen',
  'closed': 'Geschlossen'
};

const ORDER_STATUS_MAP = {
  'credit_check_started': 'Bonität gestartet',
  'credit_check_passed': 'Bonität bestätigt',
  'lease_contract_sent': 'Vertrag versandt',
  'lease_contract_signed': 'Vertrag unterschrieben',
  'in_delivery': 'In Auslieferung',
  'delivered': 'Ausgeliefert',
  'credit_check_failed': 'Bonität abgelehnt',
  'cancelled': 'Storniert'
};

const isSalaryStatus = (status: string): status is SalaryStatus => {
  return Object.keys(SALARY_STATUS_MAP).includes(status);
};

const getStatusDisplay = (request: VehicleRequestWithCompany) => {
  if (request.isOrder && (request.category === 'private' || request.category === 'company')) {
    return ORDER_STATUS_MAP[request.status as OrderStatus] || 'Unbekannt';
  }
  return SALARY_STATUS_MAP[request.status as SalaryStatus] || 'Unbekannt';
};

const getStatusColor = (status: SalaryStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500 text-white';
    case 'lease_offer_sent':
    case 'lease_request_submitted':
      return 'bg-blue-500 text-white';
    case 'lease_request_approved':
    case 'delivered':
    case 'salary_conversion_approved':
    case 'approved':
      return 'bg-green-500 text-white';
    case 'lease_request_rejected':
    case 'salary_conversion_rejected':
    case 'rejected':
      return 'bg-red-500 text-white';
    case 'in_delivery':
      return 'bg-purple-500 text-white';
    case 'withdrawn':
    case 'closed':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const statusIcons: Record<SalaryStatus, LucideIcon> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  salary_conversion_approved: CheckCircle,
  salary_conversion_rejected: XCircle,
  lease_offer_sent: Package,
  lease_request_submitted: Clock,
  lease_request_approved: CheckCircle,
  lease_request_rejected: XCircle,
  in_delivery: Car,
  delivered: CheckCircle,
  withdrawn: CircleDashed,
  closed: CircleDashed,
};

interface VehicleRequestListProps {
  requests: VehicleRequestWithCompany[];
  loading: boolean;
  error: string | null;
  onUpdateStatus?: (requestId: string, newStatus: SalaryStatus) => Promise<void>;
  selectedStatus?: SalaryStatus;
  onDeleteRequest?: (requestId: string) => Promise<void>;
}

const VehicleRequestList: React.FC<VehicleRequestListProps> = ({
  requests,
  loading,
  error,
  onUpdateStatus,
  selectedStatus,
  onDeleteRequest,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin';
  const isBroker = user?.role === 'broker';
  const isEmployer = user?.role === 'employer';

  // Log admin status when component mounts or user changes
  useEffect(() => {
    console.log('Current user role:', user?.role);
    console.log('Is admin:', isAdmin);
  }, [user, isAdmin]);

  const handleDeleteClick = (requestId: string) => {
    console.log('Delete clicked for request:', requestId);
    console.log('User is admin:', isAdmin);
    setSelectedRequestId(requestId);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRequestId && onDeleteRequest) {
      setIsDeleting(true);
      setDeleteError(null);
      try {
        console.log('Attempting to delete request:', selectedRequestId);
        await onDeleteRequest(selectedRequestId);
        console.log('Request deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedRequestId(null);
      } catch (error) {
        console.error('Error deleting request:', error);
        setDeleteError('Fehler beim Löschen der Anfrage. Bitte versuchen Sie es erneut.');
        // Zeige Fehlermeldung für 3 Sekunden
        setTimeout(() => setDeleteError(null), 3000);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleWithdrawClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    if (selectedRequestId && onUpdateStatus) {
      setIsWithdrawing(true);
      try {
        await onUpdateStatus(selectedRequestId, 'withdrawn');
      } finally {
        setIsWithdrawing(false);
        setWithdrawDialogOpen(false);
        setSelectedRequestId(null);
      }
    }
  };

  // Filter requests based on user role and status
  const filteredRequests = requests
    .filter((request: VehicleRequestWithCompany) => {
      if (isEmployer) {
        // Für Arbeitgeber: Zeige alle ausstehenden oder abgelehnten Anfragen ihrer Mitarbeiter
        return !request.isOrder && (
          // Für Gehaltsumwandlungsanfragen
          (request.type === 'salary_conversion' && ['pending', 'salary_conversion_rejected'].includes(request.status)) ||
          // Für reguläre Anfragen
          (request.type !== 'salary_conversion' && ['pending', 'rejected'].includes(request.status))
        );
      } else if (isAdmin) {
        // Für Admin: Zeige alle Anfragen
        return true;
      } else if (!isAdmin) {
        // Für Mitarbeiter: Zeige nur ihre eigenen Anfragen
        return !request.isOrder && request.userId === user?.id;
      }
      
      // Für andere Benutzer: Zeige keine Anfragen
      return false;
    })
    .filter((request) => !selectedStatus || request.status === selectedStatus);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Keine Anfragen vorhanden
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <Car className="w-8 h-8 text-blue-600" />
                <div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {request.brand} {request.model}
                    </h3>
                    <div className="space-y-1">
                      {request.trimLevel && (
                        <p className="text-sm text-gray-500">{request.trimLevel}</p>
                      )}
                      <p className="text-xs text-gray-400">Fahrzeug ID: {request.vehicleId}</p>
                      {request.isOrder && request.orderNumber && (
                        <p className="text-sm font-medium text-blue-600">
                          Bestellnummer: {request.orderNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteClick(request.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                    title="Anfrage löschen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                {isEmployer && request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateStatus?.(request.id!, request.type === 'salary_conversion' ? 'salary_conversion_rejected' : 'rejected')}
                      className="px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-red-100"
                    >
                      Ablehnen
                    </button>
                    <button
                      onClick={() => onUpdateStatus?.(request.id!, request.type === 'salary_conversion' ? 'salary_conversion_approved' : 'approved')}
                      className="px-4 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-green-100"
                    >
                      Genehmigen
                    </button>
                  </div>
                )}
                {isAdmin ? (
                  <div className="relative">
                    <select
                      value={request.status}
                      onChange={(e) => onUpdateStatus?.(request.id!, e.target.value as SalaryStatus)}
                      className={`appearance-none pr-8 pl-3 py-2 text-sm rounded-lg ${getStatusColor(request.status as SalaryStatus)} border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 transition-shadow duration-150`}
                    >
                      {request.isOrder && (request.category === 'private' || request.category === 'company')
                        ? Object.entries(ORDER_STATUS_MAP).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))
                        : Object.entries(SALARY_STATUS_MAP).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                  </div>
                ) : (
                  <span className={`px-3 py-1.5 text-sm rounded-full ${getStatusColor(isSalaryStatus(request.status) ? request.status : 'pending')} flex items-center gap-1.5`}>
                    {React.createElement(statusIcons[isSalaryStatus(request.status) ? request.status : 'pending'], { className: "w-4 h-4" })}
                    {getStatusDisplay(request)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              {request.trimLevel && <p>{request.trimLevel}</p>}
              {request.color && <p>Farbe: {request.color}</p>}
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>Laufzeit: {request.duration} Monate</p>
                    <p>Laufleistung: {request.mileagePerYear.toLocaleString()} km/Jahr</p>
                  </div>
                  <div>
                    <p>Monatliche Rate: {request.monthlyRate.toLocaleString('de-DE', {
                      style: 'currency',
                      currency: 'EUR'
                    })}</p>
                    <p>Erstellt am: {formatDate(getDateFromTimestamp(request.createdAt))}</p>
                  </div>
                </div>

                {!isBroker && !isAdmin && request.type === 'salary_conversion' && request.salaryConversion && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Gehaltsumwandlung Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p>Bruttogehalt: {request.salaryConversion.grossSalary.toLocaleString('de-DE', {
                          style: 'currency',
                          currency: 'EUR'
                        })}</p>
                        <p>Steuerklasse: {request.salaryConversion.taxClass}</p>
                        <p>Kirchensteuer: {request.salaryConversion.churchTax}</p>
                      </div>
                      <div>
                        <p>Laden beim AG: {request.salaryConversion.powerCosts}</p>
                        <p>Entfernung: {request.salaryConversion.distance} km</p>
                        <p>Effektivkosten: {request.salaryConversion.effectiveCost.toLocaleString('de-DE', {
                          style: 'currency',
                          currency: 'EUR'
                        })}</p>
                      </div>
                    </div>

                    {!isBroker && request.employee && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Mitarbeiter Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                          <div>
                            <p>Name: {request.employee.firstName} {request.employee.lastName}</p>
                            <p>Straße: {request.employee.street}</p>
                            <p>PLZ/Ort: {request.employee.postalCode} {request.employee.city}</p>
                          </div>
                          <div>
                            <p>Email: {request.employee.email}</p>
                            <p>Telefon: {request.employee.mobileNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isAdmin && request.status === 'pending' && request.userId === user?.id && (
                <div className="mt-6">
                  <button
                    onClick={() => handleWithdrawClick(request.id!)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors duration-150"
                  >
                    Anfrage zurückziehen
                  </button>
                </div>
              )}

              {/* Show employer approval status for admins */}
              {isAdmin && request.type === 'salary_conversion' && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Arbeitgeber Freigabe</h4>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1.5 text-sm rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'salary_conversion_approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'salary_conversion_rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status === 'pending' ? 'Ausstehend' :
                       request.status === 'salary_conversion_approved' ? 'Genehmigt' :
                       request.status === 'salary_conversion_rejected' ? 'Abgelehnt' :
                       'Unbekannt'}
                    </span>
                  </div>
                </div>
              )}

              {/* Company information for admin and broker */}
              {(isAdmin || isBroker) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Arbeitgeber Informationen</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p>Unternehmen: {request.company.name}</p>
                      <p>Kontaktperson: {request.company.contactPerson}</p>
                    </div>
                    <div>
                      <p>Email: {request.company.email}</p>
                      <p>Telefon: {request.company.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Fahrzeuganfrage löschen"
          message={deleteError || "Sind Sie sicher, dass Sie diese Fahrzeuganfrage löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."}
          isDeleting={isDeleting}
        />
      )}

      {withdrawDialogOpen && (
        <DeleteConfirmationDialog
          isOpen={withdrawDialogOpen}
          onClose={() => {
            setWithdrawDialogOpen(false);
            setSelectedRequestId(null);
          }}
          onConfirm={handleWithdrawConfirm}
          title="Anfrage zurückziehen"
          message="Sind Sie sicher, dass Sie diese Anfrage zurückziehen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
          isDeleting={isWithdrawing}
        />
      )}

      {deleteError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {deleteError}
        </div>
      )}
    </>
  );
};

export default VehicleRequestList;
