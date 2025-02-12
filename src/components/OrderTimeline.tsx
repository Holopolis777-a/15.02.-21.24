import React from 'react';
import { OrderStatus } from '../types/vehicleRequest';
import { CreditCard, CheckCircle, XCircle, FileText, Car, Package, LucideIcon } from 'lucide-react';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; description: string; icon: LucideIcon }> = {
  'credit_check_started': {
    label: 'Bonität gestartet',
    description: 'Ihre Bonitätsprüfung wird durchgeführt',
    icon: CreditCard
  },
  'credit_check_passed': {
    label: 'Bonität bestätigt',
    description: 'Ihre Bonität wurde erfolgreich geprüft',
    icon: CheckCircle
  },
  'lease_contract_sent': {
    label: 'Vertrag versandt',
    description: 'Der digitale Vertrag wurde per SMS an Sie versandt',
    icon: FileText
  },
  'lease_contract_signed': {
    label: 'Vertrag unterschrieben',
    description: 'Der Vertrag wurde erfolgreich unterschrieben',
    icon: CheckCircle
  },
  'in_delivery': {
    label: 'In Auslieferung',
    description: 'Ihr Fahrzeug wird für die Auslieferung vorbereitet',
    icon: Package
  },
  'delivered': {
    label: 'Ausgeliefert',
    description: 'Ihr Fahrzeug wurde erfolgreich ausgeliefert',
    icon: Car
  },
  'credit_check_failed': {
    label: 'Bonität abgelehnt',
    description: 'Aktuell können wir Ihnen leider kein Angebot Unterbreiten',
    icon: XCircle
  },
  'cancelled': {
    label: 'Storniert',
    description: 'Die Bestellung wurde storniert',
    icon: XCircle
  }
};

const timelineSteps = [
  'credit_check_started',
  'credit_check_passed',
  'lease_contract_sent',
  'lease_contract_signed',
  'in_delivery',
  'delivered'
] as OrderStatus[];

const getStepStatus = (stepStatus: OrderStatus, currentStatus: OrderStatus) => {
  const stepIndex = timelineSteps.indexOf(stepStatus);
  const currentIndex = timelineSteps.indexOf(currentStatus);

  if (currentStatus === 'credit_check_failed') {
    return stepStatus === 'credit_check_started' ? 'failed' : 'pending';
  }

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'pending';
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  if (currentStatus === 'cancelled' || currentStatus === 'credit_check_failed') {
    const isRejected = currentStatus === 'credit_check_failed';
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <XCircle className="w-6 h-6 mb-2" />
        <h3 className="font-semibold">{isRejected ? 'Bonität abgelehnt' : 'Bestellung storniert'}</h3>
        <p className="text-sm">
          {isRejected 
            ? 'Aktuell können wir Ihnen leider kein Angebot unterbreiten' 
            : 'Diese Bestellung wurde storniert.'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200" />
      <div className="space-y-8">
        {timelineSteps.map((stepStatus) => {
          const status = getStepStatus(stepStatus, currentStatus);
          const step = ORDER_STATUS_MAP[stepStatus];
          const Icon = step.icon;

          return (
            <div key={stepStatus} className="relative flex items-start">
              <div className={`
                absolute left-8 -translate-x-1/2 flex h-4 w-4 items-center justify-center rounded-full ring-8 ring-white
                ${status === 'completed' ? 'bg-green-500' : ''}
                ${status === 'current' ? 'bg-blue-500' : ''}
                ${status === 'failed' ? 'bg-red-500' : ''}
                ${status === 'pending' ? 'bg-gray-200' : ''}
              `} />
              <div className="ml-12">
                <div className="flex items-center">
                  <Icon className={`
                    w-5 h-5 mr-2
                    ${status === 'completed' ? 'text-green-500' : ''}
                    ${status === 'current' ? 'text-blue-500' : ''}
                    ${status === 'failed' ? 'text-red-500' : ''}
                    ${status === 'pending' ? 'text-gray-400' : ''}
                  `} />
                  <h3 className={`
                    font-medium
                    ${status === 'completed' ? 'text-green-900' : ''}
                    ${status === 'current' ? 'text-blue-900' : ''}
                    ${status === 'failed' ? 'text-red-900' : ''}
                    ${status === 'pending' ? 'text-gray-500' : ''}
                  `}>
                    {step.label}
                  </h3>
                </div>
                <p className={`
                  mt-1 text-sm
                  ${status === 'completed' ? 'text-green-700' : ''}
                  ${status === 'current' ? 'text-blue-700' : ''}
                  ${status === 'failed' ? 'text-red-700' : ''}
                  ${status === 'pending' ? 'text-gray-400' : ''}
                `}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
