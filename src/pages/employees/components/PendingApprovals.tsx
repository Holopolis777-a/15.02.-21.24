import React, { useEffect, useState } from 'react';
import { collection, query, where, doc, updateDoc, getDoc, onSnapshot, QuerySnapshot, DocumentData, Unsubscribe } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useCurrentCompany } from '../../../hooks/useCurrentCompany';
import { Check, X } from 'lucide-react';
import { sendApprovalNotificationEmail } from '../../../lib/email/employeeEmails';

interface PendingEmployee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  portalType: 'normal' | 'salary';
}

const PendingApprovals = () => {
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const { company, loading: companyLoading } = useCurrentCompany();

  const handleApproval = async (employeeId: string, approved: boolean) => {
    try {
      const inviteRef = doc(db, 'employeeInvites', employeeId);
      const inviteDoc = await getDoc(inviteRef);
      
      if (!inviteDoc.exists()) {
        console.error('Invite document not found');
        return;
      }

      const inviteData = inviteDoc.data();
      console.log('Updating invite status:', { employeeId, approved, inviteData });
      
      const updateData = {
        status: approved ? 'active' : 'rejected',
        approvedAt: new Date()
      };

      // Update the invite
      await updateDoc(inviteRef, updateData);

      // Update the user document if it exists
      if (inviteData.userId) {
        const userRef = doc(db, 'users', inviteData.userId);
        await updateDoc(userRef, updateData);
      }

      // Send email notification
      await sendApprovalNotificationEmail(
        inviteData.email,
        inviteData.firstName,
        inviteData.lastName,
        approved,
        inviteData.portalType
      );
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const setupListener = async () => {
      if (companyLoading) {
        console.log('Company data is still loading...');
        return;
      }

      if (!company?.id) {
        console.log('No company ID available:', company);
        setLoading(false);
        return;
      }

      try {
        console.log('Setting up listener for company:', company.id);
        console.log('Setting up query with params:', {
          companyId: company.id,
          conditions: {
            companyId: company.id,
            status: 'pending',
            inviteType: 'employee'
          }
        });

        // Query invites using both companyId and employerCompanyId fields
        const q1 = query(
          collection(db, 'employeeInvites'),
          where('companyId', '==', company.id),
          where('status', '==', 'pending')
        );

        const q2 = query(
          collection(db, 'employeeInvites'),
          where('employerCompanyId', '==', company.id),
          where('status', '==', 'pending')
        );

        // Set up listeners for both queries
        let unsubscribe2: (() => void) | undefined;

        const unsubscribe1 = onSnapshot(
          q1,
          (snapshot1) => {
            unsubscribe2 = onSnapshot(
              q2,
              (snapshot2) => {
                // Combine results from both queries
                const allDocs = [...snapshot1.docs, ...snapshot2.docs];
                
                // Filter out duplicates and empty/unregistered invites
                const uniqueDocs = allDocs.reduce((acc, doc) => {
                  const data = doc.data();
                  // Only include if:
                  // 1. Document hasn't been added yet (avoid duplicates)
                  // 2. AND either has an email (email invite) or userId (registered link invite)
                  if (!acc.find(d => d.id === doc.id) && 
                      (data.email || data.userId)) {
                    acc.push(doc);
                  }
                  return acc;
                }, [] as typeof allDocs);

                console.log('Snapshot received, docs count:', uniqueDocs.length);
                
                let employees: PendingEmployee[] = [];
                try {
                  employees = uniqueDocs
                    .map(docSnapshot => {
                      try {
                        const data = docSnapshot.data();
                        console.log('Raw employee data:', data);
                        
                        if (!data) {
                          console.error('No data found in document');
                          return null;
                        }
                        
                        // Extract and normalize the data
                        const employeeData: PendingEmployee = {
                          id: docSnapshot.id,
                          email: data.email || '',
                          firstName: data.firstName || '',
                          lastName: data.lastName || '',
                          createdAt: data.createdAt?.toDate() || data.registeredAt?.toDate() || new Date(),
                          portalType: data.portalType || 'normal'
                        };
                        
                        console.log('Processed employee data:', employeeData);
                        return employeeData;
                      } catch (error) {
                        console.error('Error processing employee data:', error);
                        return null;
                      }
                    })
                    .filter((employee): employee is PendingEmployee => employee !== null);

                  console.log('Total pending employees:', employees.length);
                  setPendingEmployees(employees);
                  setLoading(false);
                } catch (error) {
                  console.error('Error processing employees:', error);
                  setLoading(false);
                }
              },
              (error) => {
                console.error('Error in pending employees listener (query 2):', error);
                setLoading(false);
              }
            );
          },
          (error) => {
            console.error('Error in pending employees listener (query 1):', error);
            setLoading(false);
          }
        );

        return () => {
          unsubscribe1();
          if (unsubscribe2) {
            unsubscribe2();
          }
        };
      } catch (error) {
        console.error('Error setting up listener:', error);
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        console.log('Cleaning up listener');
        unsubscribe();
      }
    };
  }, [company?.id, companyLoading]);

  if (loading || companyLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Offene Genehmigungen</h2>
        <p className="text-gray-600">Laden...</p>
      </div>
    );
  }

  if (!company?.id) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Offene Genehmigungen</h2>
        <p className="text-gray-600">Keine Firma zugeordnet</p>
      </div>
    );
  }

  if (pendingEmployees.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Offene Genehmigungen</h2>
        <p className="text-gray-600">Keine ausstehenden Genehmigungen</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Offene Genehmigungen</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mitarbeiter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrierungsdatum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.createdAt.toLocaleDateString('de-DE')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproval(employee.id, true)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Genehmigen
                    </button>
                    <button
                      onClick={() => handleApproval(employee.id, false)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Ablehnen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovals;
