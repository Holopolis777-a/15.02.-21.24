import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import type { Customer, CustomerInvite } from '../../../types/customer';
import { FiMail, FiLink, FiPackage, FiCalendar, FiCheck, FiClock } from 'react-icons/fi';
import { useAuthStore } from '../../../store/authStore';

interface CustomersListProps {
  brokerId: string;
}

interface CustomerWithDetails extends Customer {
  invite?: CustomerInvite;
  orderCount?: number;
}

const CustomersList: React.FC<CustomersListProps> = ({ brokerId }) => {
  const { user } = useAuthStore();
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!brokerId || !user) {
        console.log('No broker ID provided or user not authenticated');
        setLoading(false);
        return;
      }

      // Überprüfe Broker-Rolle
      const userDoc = await getDoc(doc(db, 'users', user.id));
      if (!userDoc.exists() || userDoc.data().role !== 'broker') {
        setError('Keine Broker-Berechtigung');
        setLoading(false);
        return;
      }

      try {
        // Kunden abrufen
        const customersQuery = query(
          collection(db, 'customers'),
          where('brokerId', '==', brokerId)
        );
        const customersSnapshot = await getDocs(customersQuery);
        
        // Einladungen abrufen
        const invitesQuery = query(
          collection(db, 'customerInvites'),
          where('brokerId', '==', brokerId)
        );
        const invitesSnapshot = await getDocs(invitesQuery);
        const invites = invitesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          expiresAt: doc.data().expiresAt?.toDate()
        })) as CustomerInvite[];

        // Bestellungen abrufen
        const ordersQuery = query(
          collection(db, 'orders'),
          where('brokerId', '==', brokerId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const orderCounts = new Map<string, number>();
        ordersSnapshot.docs.forEach(doc => {
          const customerId = doc.data().customerId;
          orderCounts.set(customerId, (orderCounts.get(customerId) || 0) + 1);
        });

        // Daten zusammenführen
        const customersList = customersSnapshot.docs.map(doc => {
          const customer = {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          } as CustomerWithDetails;

          customer.invite = invites.find(invite => invite.email === customer.email);
          customer.orderCount = orderCounts.get(customer.id) || 0;

          return customer;
        });

        setCustomers(customersList);
        setError(null);
      } catch (error) {
        console.error('Error fetching customers:', {
          error,
          brokerId,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        setError('Fehler beim Laden der Kunden');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [brokerId]);

  if (loading) {
    return <div className="text-center py-4">Laden...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Noch keine Kunden vorhanden. Laden Sie Ihre ersten Kunden ein!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <div key={customer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Header mit Status */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white truncate">
                {customer.fullName}
              </h3>
              <div className="flex items-center space-x-2">
                {customer.invite?.type === 'email' ? (
                  <FiMail className="text-white" title="Per E-Mail eingeladen" />
                ) : (
                  <FiLink className="text-white" title="Per Link eingeladen" />
                )}
                {customer.invite?.status === 'accepted' ? (
                  <FiCheck className="text-green-300" title="Registriert" />
                ) : (
                  <FiClock className="text-yellow-300" title="Ausstehend" />
                )}
              </div>
            </div>
          </div>

          {/* Hauptinhalt */}
          <div className="px-6 py-4">
            <div className="space-y-3">
              <p className="text-gray-600 flex items-center">
                <FiMail className="mr-2" />
                {customer.email}
              </p>
              <p className="text-gray-600">
                {customer.street} {customer.houseNumber}
                <br />
                {customer.postalCode} {customer.city}
              </p>
              <p className="text-gray-600 flex items-center">
                📞 {customer.phoneNumber}
              </p>
            </div>
          </div>

          {/* Footer mit Statistiken */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-gray-600">
                <FiPackage className="mr-2" />
                {customer.orderCount} {customer.orderCount === 1 ? 'Bestellung' : 'Bestellungen'}
              </div>
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2" />
                {customer.createdAt?.toLocaleDateString('de-DE')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomersList;
