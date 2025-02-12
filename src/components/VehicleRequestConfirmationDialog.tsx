import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBrokerData } from '../hooks/useBrokerData';
import { useCompanyData } from '../hooks/useCompanyData';

interface VehicleRequestConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  isSalaryConversion: boolean;
}

const VehicleRequestConfirmationDialog: React.FC<VehicleRequestConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  isSalaryConversion
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { brokerData } = useBrokerData();
  const { company } = useCompanyData();
  const user = useAuthStore.getState().user;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Fahrzeuganfrage bestätigen
        </h3>
        
        <div className="mb-6 space-y-4">
          {/* User/Company Profile Data */}
          <div className="bg-gray-50 p-4 rounded-lg">
            {user?.role === 'employer' ? (
              <>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ihre Daten:</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Firma:</span>
                    <span className="ml-2 text-gray-900">{company?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{company?.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Straße:</span>
                    <span className="ml-2 text-gray-900">{company?.address?.street}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">PLZ:</span>
                    <span className="ml-2 text-gray-900">{company?.address?.postalCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ort:</span>
                    <span className="ml-2 text-gray-900">{company?.address?.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Handynummer:</span>
                    <span className="ml-2 text-gray-900">{company?.phone}</span>
                  </div>
                </div>
              </>
            ) : user?.role === 'broker' ? (
              <>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Firmendaten:</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Firma:</span>
                    <span className="ml-2 text-gray-900">{brokerData?.companyName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Straße:</span>
                    <span className="ml-2 text-gray-900">{brokerData?.address?.street}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">PLZ:</span>
                    <span className="ml-2 text-gray-900">{brokerData?.address?.postalCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ort:</span>
                    <span className="ml-2 text-gray-900">{brokerData?.address?.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <span className="ml-2 text-gray-900">{brokerData?.phone}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ihre Daten:</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Straße:</span>
                    <span className="ml-2 text-gray-900">{user?.street} {user?.houseNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">PLZ:</span>
                    <span className="ml-2 text-gray-900">{user?.postalCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ort:</span>
                    <span className="ml-2 text-gray-900">{user?.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Handynummer:</span>
                    <span className="ml-2 text-gray-900">{user?.mobileNumber}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {isSalaryConversion ? (
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                Hiermit bestätige ich die Auswahl des Fahrzeuges und leite die Bestellung zur Freigabe an meinen Arbeitgeber weiter. Nach der Genehmigung durch den Arbeitgeber wird das Fahrzeug verbindlich bestellt.
              </p>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span>
                  Ich bestätige die Auswahl und leite die Bestellung zur Freigabe weiter.
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                Im Rahmen der Bearbeitung Ihrer Anfrage werden Ihre E-Mail-Adresse und Ihre Mobiltelefonnummer an die Santander Consumer Bank AG übermittelt. Die Übertragung erfolgt ausschließlich zum Zweck der Bearbeitung Ihres Anliegens sowie zur Kontaktaufnahme im Zusammenhang mit Ihrer Anfrage.
              </p>
              <p>
                Die Verarbeitung Ihrer Daten erfolgt gemäß den geltenden Datenschutzbestimmungen, insbesondere der DSGVO. Weitere Informationen zur Datenverarbeitung und Ihren Rechten entnehmen Sie bitte der Datenschutzerklärung der Santander Consumer Bank AG sowie unserer eigenen Datenschutzerklärung.
              </p>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span>
                  Ich stimme der Übermittlung und Verarbeitung meiner Daten gemäß der oben genannten Datenschutzbestimmungen zu.
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={!isConfirmed || isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              !isConfirmed || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Wird gesendet...' : user?.role === 'employer' ? 'Jetzt verbindlich bestellen' : 'Anfrage senden'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleRequestConfirmationDialog;
