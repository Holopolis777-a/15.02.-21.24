import { collection, addDoc, query, where, getDocs, getDoc, doc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config';
import { VehicleRequest, VehicleRequestWithCompany, OrderStatus } from '../../../types/vehicleRequest';
import { Company } from '../../../types/company';
import { generateOrderNumber } from '../../../utils/orderUtils';

const REQUESTS_COLLECTION = 'vehicleRequests';
const COMPANIES_COLLECTION = 'companies';
const USERS_COLLECTION = 'users';

export const createVehicleRequest = async (request: Omit<VehicleRequest, 'id' | 'createdAt'> & { company?: any }) => {
  try {
    console.log('Creating vehicle request:', request);
    // Extract company data if present
    const { company, status, ...requestData } = request;
    
    // Entferne undefined-Werte aus den Daten
    const cleanedData = Object.entries(requestData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    // Für Gehaltsumwandlungsanfragen immer als Anfrage erstellen
    const isGehaltsumwandlung = request.type === 'salary_conversion';
    
    const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), {
      ...cleanedData,
      status: status || 'pending',
      createdAt: serverTimestamp(),
      type: request.type || 'regular',
      // Nur für nicht-Gehaltsumwandlungsanfragen als Bestellung markieren
      isOrder: !isGehaltsumwandlung && request.isOrder,
      // Generate order number only for non-salary-conversion orders
      ...((!isGehaltsumwandlung && request.isOrder) ? { orderNumber: generateOrderNumber() } : {}),
      // Include company data in the document if present
      ...(company ? { company } : {})
    });
    console.log('Created vehicle request:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating vehicle request:', error);
    throw error;
  }
};

// Helper function to get companies invited by a broker
const getBrokerInvitedCompanyIds = async (brokerId: string): Promise<string[]> => {
  try {
    // First get the broker's own company ID
    const brokerCompanyId = brokerId;
    
    // Include the broker's own company ID in the results
    const companyIds = [brokerCompanyId];
    
    console.log('Found broker invited companies:', companyIds);
    return companyIds;
  } catch (error) {
    console.error('Error getting broker invited companies:', error);
    return [];
  }
};


export const getCompanyData = async (companyId: string) => {
  try {
    // First try to get broker data
    const brokerDoc = await getDoc(doc(db, 'brokers', companyId));
    if (brokerDoc.exists()) {
      const broker = brokerDoc.data();
      return {
        name: broker.companyName || 'Unbekanntes Unternehmen',
        contactPerson: broker.fullName || 'Nicht verfügbar',
        email: broker.email || '',
        phone: broker.phone || '',
      };
    }

    // If not a broker, try to get company data
    const companyDoc = await getDoc(doc(db, COMPANIES_COLLECTION, companyId));
    if (!companyDoc.exists()) {
      console.warn(`Company not found for ID: ${companyId}, using default data`);
      return {
        name: 'Unbekanntes Unternehmen',
        contactPerson: 'Nicht verfügbar',
        email: '',
        phone: '',
      };
    }
    const company = companyDoc.data() as Company;
    return {
      name: company.name || 'Unbekanntes Unternehmen',
      contactPerson: company.contactPerson || 'Nicht verfügbar',
      email: company.email || '',
      phone: company.phone || '',
    };
  } catch (error) {
    console.error('Error fetching company data:', error);
    return {
      name: 'Unbekanntes Unternehmen',
      contactPerson: 'Nicht verfügbar',
      email: '',
      phone: '',
    };
  }
};

const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!userDoc.exists()) {
      console.warn(`User not found for ID: ${userId}, using default data`);
      return {
        firstName: 'Nicht',
        lastName: 'Verfügbar',
        street: '',
        city: '',
        postalCode: '',
        email: '',
        mobileNumber: '',
      };
    }
    const userData = userDoc.data();
    return {
      firstName: userData.firstName || 'Nicht',
      lastName: userData.lastName || 'Verfügbar',
      street: userData.street || '',
      city: userData.city || '',
      postalCode: userData.postalCode || '',
      email: userData.email || '',
      mobileNumber: userData.mobileNumber || '',
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      firstName: 'Nicht',
      lastName: 'Verfügbar',
      street: '',
      city: '',
      postalCode: '',
      email: '',
      mobileNumber: '',
    };
  }
};

export const getVehicleRequestsByBroker = async (brokerId: string) => {
  try {
    console.log('Getting vehicle requests for broker:', brokerId);
    
    // Query requests where the broker is the creator
    const q = query(
      collection(db, REQUESTS_COLLECTION),
      where('userId', '==', brokerId)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Found requests:', querySnapshot.size);

    // Process all requests
    const requests = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Use stored company data if available, otherwise fetch it
        const company = data.company || await getCompanyData(data.companyId);
        const employee = await getUserData(data.userId);

        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          company,
          employee,
        };
      })
    );
    return requests as VehicleRequestWithCompany[];
  } catch (error) {
    console.error('Error getting broker vehicle requests:', error);
    throw error;
  }
};

export const getAllVehicleRequests = async () => {
  try {
    console.log('Getting all vehicle requests');
    const querySnapshot = await getDocs(collection(db, REQUESTS_COLLECTION));
    console.log('Found requests:', querySnapshot.size);
    const requests = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Use stored company data if available, otherwise fetch it
        const company = data.company || await getCompanyData(data.companyId);
        const employee = await getUserData(data.userId);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          company,
          employee,
        };
      })
    );
    return requests as VehicleRequestWithCompany[];
  } catch (error) {
    console.error('Error getting all vehicle requests:', error);
    throw error;
  }
};

export const getVehicleRequestsByCompany = async (companyId: string) => {
  try {
    console.log('Getting vehicle requests for company:', companyId);
    const q = query(
      collection(db, REQUESTS_COLLECTION),
      where('companyId', '==', companyId)
    );
    console.log('Company query created');
    const querySnapshot = await getDocs(q);
    const requests = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Use stored company data if available, otherwise fetch it
        const company = data.company || await getCompanyData(data.companyId);
        const employee = await getUserData(data.userId);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          company,
          employee,
        };
      })
    );
    return requests as VehicleRequestWithCompany[];
  } catch (error) {
    console.error('Error getting vehicle requests:', error);
    throw error;
  }
};

export const updateVehicleRequestStatus = async (requestId: string, newStatus: VehicleRequest['status']) => {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    const requestDoc = await getDoc(docRef);
    
    if (!requestDoc.exists()) {
      throw new Error('Request not found');
    }

    const request = requestDoc.data() as VehicleRequest;

    // Handle different types of requests
    if (request.type === 'salary_conversion') {
      // For salary conversion requests
      if (newStatus === 'salary_conversion_approved') {
        // Create a new order from the approved request
        const { id, createdAt, status, ...requestData } = request;
        const orderData = {
          ...requestData,
          isOrder: true,
          status: 'credit_check_started' as OrderStatus,
          orderNumber: generateOrderNumber(),
          originalRequestId: requestId,
        };

        // Save the new order
        await addDoc(collection(db, REQUESTS_COLLECTION), {
          ...orderData,
          createdAt: serverTimestamp(),
        });
      }
    } else {
      // For regular requests
      if (newStatus === 'approved') {
        // Create a new order from the approved request
        const { id, createdAt, status, ...requestData } = request;
        const orderData = {
          ...requestData,
          isOrder: true,
          status: 'credit_check_started' as OrderStatus,
          orderNumber: generateOrderNumber(),
          originalRequestId: requestId,
        };

        // Save the new order
        await addDoc(collection(db, REQUESTS_COLLECTION), {
          ...orderData,
          createdAt: serverTimestamp(),
        });
      }
    }

    // Update the status of the original request
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating vehicle request status:', error);
    throw error;
  }
};

export const getVehicleRequestsByUser = async (userId: string) => {
  try {
    console.log('Getting vehicle requests for user:', userId);
    const q = query(
      collection(db, REQUESTS_COLLECTION),
      where('userId', '==', userId)
    );
    console.log('User query created');
    const querySnapshot = await getDocs(q);
    const requests = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        // Use stored company data if available, otherwise fetch it
        const company = data.company || await getCompanyData(data.companyId);
        const employee = await getUserData(data.userId);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          company,
          employee,
        };
      })
    );
    return requests as VehicleRequestWithCompany[];
  } catch (error) {
    console.error('Error getting user vehicle requests:', error);
    throw error;
  }
};

export const deleteVehicleRequest = async (requestId: string) => {
  try {
    console.log('Deleting vehicle request:', requestId);
    
    // Get the current user's role from Firestore
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('Benutzer ist nicht authentifiziert');
    }

    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (!userDoc.exists()) {
      throw new Error('Benutzerdaten nicht gefunden');
    }

    const userData = userDoc.data();
    if (userData.role !== 'admin') {
      throw new Error('Nur Administratoren können Anfragen löschen');
    }

    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    await deleteDoc(docRef);
    console.log('Vehicle request deleted successfully');
  } catch (error) {
    console.error('Error deleting vehicle request:', error);
    throw error;
  }
};
