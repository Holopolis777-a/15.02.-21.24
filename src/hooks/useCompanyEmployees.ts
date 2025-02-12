import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from './useAuthStore';

export interface CompanyEmployee {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  companyId: string;
  portalType?: 'normal' | 'salary';
  status: 'invited' | 'approved' | 'pending';
  createdAt: string;
  portalTypeDe: string;
  statusDe: string;
  inviteMethod?: 'link' | 'email';
  needsApproval?: boolean;
}

export const useCompanyEmployees = (): { 
  employees: CompanyEmployee[]; 
  loading: boolean; 
  error: string | null; 
} => {
  const [employees, setEmployees] = useState<CompanyEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    console.log('useCompanyEmployees effect triggered', { 
      userId: user?.id, 
      userEmail: user?.email, 
      userRole: user?.role,
      userCompanyId: user?.companyId,
      userEmployerCompanyId: user?.employerCompanyId
    });

    if (!user) {
      console.log('No user found');
      setLoading(false);
      setError('Kein Benutzer angemeldet. Bitte melden Sie sich erneut an.');
      return;
    }

    console.log('User role:', user.role);

    const fetchCompanyAndEmployees = async () => {
      try {
        let companyId = user.companyId || user.employerCompanyId;
        console.log('Initial companyId:', companyId);

        if (!companyId && user.role === 'employer') {
          console.log('Searching for company where user is the owner');
          let companiesQuery = query(
            collection(db, 'companies'),
            where('ownerId', '==', user.id)
          );
          let companiesSnapshot = await getDocs(companiesQuery);
          console.log('Companies found with ownerId:', companiesSnapshot.size);
          
          if (companiesSnapshot.empty) {
            console.log('No company found with ownerId, trying email');
            companiesQuery = query(
              collection(db, 'companies'),
              where('email', '==', user.email)
            );
            companiesSnapshot = await getDocs(companiesQuery);
            console.log('Companies found with email:', companiesSnapshot.size);
          }
          
          if (!companiesSnapshot.empty) {
            companyId = companiesSnapshot.docs[0].id;
            console.log('Found company:', companyId);
          } else {
            console.log('No company found for the employer');
            throw new Error('Keine Firma für den Arbeitgeber gefunden');
          }
        }

        if (!companyId) {
          console.log('No companyId found');
          throw new Error('Keine Firma zugeordnet');
        }

        console.log('Final Company ID:', companyId);

        console.log('Fetching employees for companyId:', companyId);

            // Query users with companyId
            const usersQuery = query(collection(db, 'users'), where('companyId', '==', companyId));
            // Query users with employerCompanyId
            const employerUsersQuery = query(collection(db, 'users'), where('employerCompanyId', '==', companyId));
            // Query invites using both companyId and employerCompanyId
            const invitesQuery1 = query(
              collection(db, 'employeeInvites'),
              where('companyId', '==', companyId)
            );
            const invitesQuery2 = query(
              collection(db, 'employeeInvites'),
              where('employerCompanyId', '==', companyId)
            );

                const processSnapshot = (
                  userDocs: QueryDocumentSnapshot<DocumentData>[], 
                  inviteDocs: QueryDocumentSnapshot<DocumentData>[]
                ) => {
              // Process registered users
                  const registeredEmployees = userDocs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  role: data.role,
                  companyId: data.companyId,
                  employerCompanyId: data.employerCompanyId,
                  portalType: data.portalType || 'normal',
                  status: 'approved',
                  createdAt: data.createdAt ? 
                    (typeof data.createdAt.toDate === 'function' ? 
                      data.createdAt.toDate().toISOString() : 
                      new Date(data.createdAt).toISOString()
                    ) : new Date().toISOString(),
                  portalTypeDe: data.portalType === 'salary' ? 'Gehaltsportal' : 'Mitarbeiterportal',
                  statusDe: 'Registriert',
                  needsApproval: false
                } as CompanyEmployee;
              });

          // Process invited employees
          const invitedEmployees = inviteDocs
            .map((doc) => {
              const data = doc.data();
              // Only include invites that:
              // 1. Have an email (email-based invites) OR
              // 2. Have a userId (registered link-based invites)
              if (!data.email && !data.userId) {
                return null;
              }
              
              const needsApproval = data.method === 'link' && data.userId;
              return {
                id: doc.id,
                email: data.email || '',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                role: 'invited',
                companyId: data.companyId,
                portalType: data.portalType || 'normal',
                status: data.status,
                createdAt: data.createdAt ? 
                  (typeof data.createdAt.toDate === 'function' ? 
                    data.createdAt.toDate().toISOString() : 
                    new Date(data.createdAt).toISOString()
                  ) : new Date().toISOString(),
                portalTypeDe: data.portalType === 'salary' ? 'Gehaltsportal' : 'Mitarbeiterportal',
                statusDe: data.method === 'email' ? 'Per Email eingeladen' : 'Freigabe ausstehend',
                inviteMethod: data.method,
                needsApproval
              } as CompanyEmployee;
            })
            .filter((employee): employee is CompanyEmployee => employee !== null);

          // Create a map to deduplicate by ID and email
          const employeeMap = new Map<string, CompanyEmployee>();
          
          // Add registered employees first (they take precedence)
          registeredEmployees.forEach(emp => {
            employeeMap.set(emp.id, emp);
            if (emp.email) {
              employeeMap.set(emp.email, emp);
            }
          });
          
          // Add invited employees only if they don't exist
          invitedEmployees.forEach(invited => {
            if (!employeeMap.has(invited.id) && !employeeMap.has(invited.email)) {
              employeeMap.set(invited.id, invited);
              if (invited.email) {
                employeeMap.set(invited.email, invited);
              }
            }
          });
          
          // Convert map back to array, removing email-based duplicates
          const allEmployees = Array.from(employeeMap.values()).filter((emp, index, self) => 
            index === self.findIndex(e => 
              (emp.id === e.id) || (emp.email && emp.email === e.email)
            )
          );

          console.log('Processed employee data:', { 
            registeredCount: registeredEmployees.length,
            invitedCount: invitedEmployees.length,
            totalCount: allEmployees.length,
            registeredEmployees,
            invitedEmployees,
            allEmployees
          });
          setEmployees(allEmployees);
          setLoading(false);
        };

            // Set up listeners
            const unsubscribeUsers = onSnapshot(usersQuery, (usersSnapshot) => {
              console.log('Users snapshot:', {
                count: usersSnapshot.docs.length,
                users: usersSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                }))
              });

              const unsubscribeEmployerUsers = onSnapshot(employerUsersQuery, (employerUsersSnapshot) => {
                console.log('Employer users snapshot:', {
                  count: employerUsersSnapshot.docs.length,
                  users: employerUsersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                  }))
                });

                // Combine both user snapshots
                const combinedUserDocs = [...usersSnapshot.docs, ...employerUsersSnapshot.docs];

                const unsubscribeInvites1 = onSnapshot(invitesQuery1, (invitesSnapshot1) => {
                  const unsubscribeInvites2 = onSnapshot(invitesQuery2, (invitesSnapshot2) => {
                    // Combine both invite snapshots and remove duplicates
                    const allInviteDocs = [...invitesSnapshot1.docs, ...invitesSnapshot2.docs];
                    const uniqueInviteDocs = allInviteDocs.filter((doc, index, self) =>
                      index === self.findIndex((d) => d.id === doc.id)
                    );

                    console.log('Invites snapshot:', {
                      count: uniqueInviteDocs.length,
                      invites: uniqueInviteDocs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                      }))
                    });

                    processSnapshot(combinedUserDocs, uniqueInviteDocs);
                  }, (error) => {
                    console.error('Error fetching invites (query 2):', error);
                    setError(`Fehler beim Laden der Einladungen: ${error.message}`);
                    setLoading(false);
                  });

                  return () => unsubscribeInvites2();
                }, (error) => {
                  console.error('Error fetching invites:', error);
                  setError(`Fehler beim Laden der Einladungen: ${error.message}`);
                  setLoading(false);
                });

                return () => {
                  unsubscribeInvites1();
                };
              }, (error) => {
                console.error('Error fetching employer users:', error);
                setError(`Fehler beim Laden der Mitarbeiter mit employerCompanyId: ${error.message}`);
                setLoading(false);
              });
            }, (error) => {
              console.error('Error fetching users:', error);
              setError(`Fehler beim Laden der Mitarbeiter: ${error.message}`);
              setLoading(false);
            });

        return () => unsubscribeUsers();

      } catch (error) {
        console.error('Error in fetchCompanyAndEmployees:', error);
        setError(error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten');
        setLoading(false);
      }
    };

    fetchCompanyAndEmployees();
  }, [user]);

  return { employees, loading, error };
};
