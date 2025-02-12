import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleRequestWithCompany, OrderStatus } from '../../../types/vehicleRequest';
import { formatDate } from '../../../utils/dateUtils';
import { getDateFromTimestamp } from '../../../utils/firestoreUtils';
import { useAuthStore } from '../../../store/authStore';
import { ChevronDown, Clock, CheckCircle, XCircle, Car, Package, CircleDashed, LucideIcon, Trash2, CreditCard } from 'lucide-react';
import DeleteConfirmationDialog from '../../../components/DeleteConfirmationDialog';

// Erweiterte Status-Map für Bestellungen
const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  'credit_check_started': 'Bonität gestartet',
  'credit_check_passed': 'Bonität bestätigt',
  'lease_contract_sent': 'Vertrag versandt',
  'lease_contract_signed': 'Vertrag unterschrieben',
  'in_delivery': 'In Auslieferung',
  'delivered': 'Ausgeliefert',
  'credit_check_failed': 'Bonität abgelehnt',
  'cancelled': 'Storniert'
};

const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  'credit_check_started': 'Ihre Bonitätsprüfung wird durchgeführt',
  'credit_check_passed': 'Ihre Bonität wurde erfolgreich geprüft',
  'lease_contract_sent': 'Der digitale Vertrag wurde per SMS an Sie versandt',
  'lease_contract_signed': 'Der Vertrag wurde erfolgreich unterschrieben',
  'in_delivery': 'Ihr Fahrzeug wird für die Auslieferung vorbereitet',
  'delivered': 'Ihr Fahrzeug wurde erfolgreich ausgeliefert',
  'credit_check_failed': 'Aktuell können wir Ihnen leider kein Angebot Unterbreiten',
  'cancelled': 'Die Bestellung wurde storniert'
};

const getStatusDisplay = (status: OrderStatus) => {
  return ORDER_STATUS_MAP[status];
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'credit_check_started':
      return 'bg-yellow-500 text-white';
    case 'credit_check_passed':
      return 'bg-green-500 text-white';
    case 'credit_check_failed':
      return 'bg-red-500 text-white';
    case 'lease_contract_sent':
      return 'bg-blue-500 text-white';
    case 'lease_contract_signed':
      return 'bg-teal-500 text-white';
    case 'in_delivery':
      return 'bg-purple-500 text-white';
    case 'delivered':
      return 'bg-green-600 text-white';
    case 'cancelled':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const statusIcons: Record<OrderStatus, LucideIcon> = {
  credit_check_started: CreditCard,
  credit_check_passed: CheckCircle,
  credit_check_failed: XCircle,
  lease_contract_sent: Package,
  lease_contract_signed: CheckCircle,
  in_delivery: Car,
  delivered: CheckCircle,
  cancelled: CircleDashed
};

interface OrderListProps {
  orders: VehicleRequestWithCompany[];
  loading: boolean;
  error: string | null;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  selectedStatus?: OrderStatus;
  onDeleteOrder?: (orderId: string) => Promise<void>;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  error,
  onUpdateStatus,
  selectedStatus,
  onDeleteOrder,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin';
  const isBroker = user?.role === 'broker';

  const handleDeleteClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOrderId && onDeleteOrder) {
      setIsDeleting(true);
      try {
        await onDeleteOrder(selectedOrderId);
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setSelectedOrderId(null);
      }
    }
  };

  // Filter orders based on user role and status
  const filteredOrders = orders
    .filter(order => {
      // Für Gehaltsumwandlungsanfragen
      if (order.type === 'salary_conversion') {
        // Zeige nur genehmigte Gehaltsumwandlungen als Bestellungen
        return order.status === 'salary_conversion_approved' || (order.isOrder && order.status === 'credit_check_started');
      }
      
      // Für normale Bestellungen
      return order.isOrder && (order.category === 'private' || order.category === 'company');
    })
    .filter(order => !selectedStatus || order.status === selectedStatus);

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

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Keine Bestellungen vorhanden
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={order.vehicleImage} 
                    alt={`${order.brand} ${order.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const icon = document.createElement('div');
                        icon.className = 'w-full h-full p-4 text-gray-400';
                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
                        parent.appendChild(icon);
                      }
                    }}
                  />
                </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {order.brand} {order.model}
                    </h3>
                    <div className="space-y-1">
                      {order.employee && (
                        <p className="text-sm font-medium text-blue-600">
                          {order.type === 'salary_conversion' ? 'Gehaltsumwandlung für: ' : 'Bestellt von: '}
                          {order.employee.firstName} {order.employee.lastName}
                        </p>
                      )}
                      {order.trimLevel && (
                        <p className="text-sm text-gray-500">{order.trimLevel}</p>
                      )}
                      <p className="text-xs text-gray-400">Fahrzeug ID: {order.vehicleId}</p>
                      {order.orderNumber && (
                        <p className="text-sm font-medium text-blue-600">
                          Bestellnummer: {order.orderNumber}
                        </p>
                      )}
                    </div>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteClick(order.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                    title="Bestellung löschen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                {isAdmin ? (
                  <div className="relative">
                    <select
                      value={order.status as OrderStatus}
                      onChange={(e) => onUpdateStatus?.(order.id!, e.target.value as OrderStatus)}
                      className={`appearance-none pr-8 pl-3 py-2 text-sm rounded-lg ${getStatusColor(order.status as OrderStatus)} border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 transition-shadow duration-150`}
                    >
                      {Object.entries(ORDER_STATUS_MAP).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-white" />
                  </div>
                ) : (
                  <span className={`px-3 py-1.5 text-sm rounded-full ${getStatusColor(order.status as OrderStatus)} flex items-center gap-1.5`}>
                    {React.createElement(statusIcons[order.status as OrderStatus] || CircleDashed, { className: "w-4 h-4" })}
                    {getStatusDisplay(order.status as OrderStatus)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              {order.employee && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Mitarbeiterdaten:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p>Name: {order.employee.firstName} {order.employee.lastName}</p>
                      <p>Straße: {order.employee.street}</p>
                      <p>PLZ/Ort: {order.employee.postalCode} {order.employee.city}</p>
                    </div>
                    <div>
                      <p>Email: {order.employee.email}</p>
                      <p>Telefon: {order.employee.mobileNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p>Laufzeit: {order.duration} Monate</p>
                  <p>Laufleistung: {(order.mileagePerYear || 0).toLocaleString()} km/Jahr</p>
                  {order.color && <p>Farbe: {order.color}</p>}
                </div>
                <div>
                  <p>Monatliche Rate: {typeof order.monthlyRate === 'number' ? order.monthlyRate.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                  }) : '0,00 €'}</p>
                  <p>Bestellt am: {formatDate(getDateFromTimestamp(order.createdAt))}</p>
                </div>
              </div>

              {/* Kundeninformationen für Admin und Broker */}
              {(isAdmin || isBroker) && order.employee && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Kundeninformationen</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p>Name: {order.employee.firstName} {order.employee.lastName}</p>
                      <p>Straße: {order.employee.street}</p>
                      <p>PLZ/Ort: {order.employee.postalCode} {order.employee.city}</p>
                    </div>
                    <div>
                      <p>Email: {order.employee.email}</p>
                      <p>Telefon: {order.employee.mobileNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Unternehmensinformationen für Admin und Broker */}
              {(isAdmin || isBroker) && order.company && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Unternehmensinformationen</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p>Unternehmen: {order.company.name}</p>
                      <p>Kontaktperson: {order.company.contactPerson}</p>
                    </div>
                    <div>
                      <p>Email: {order.company.email}</p>
                      <p>Telefon: {order.company.phone}</p>
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
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Bestellung löschen"
          message="Sind Sie sicher, dass Sie diese Bestellung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default OrderList;
