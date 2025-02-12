import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { VehicleRequest, VehicleRequestWithCompany } from '../types/vehicleRequest';
import { 
  createVehicleRequest, 
  getVehicleRequestsByCompany, 
  getVehicleRequestsByUser, 
  getAllVehicleRequests,
  updateVehicleRequestStatus,
  getVehicleRequestsByBroker,
  deleteVehicleRequest,
  getCompanyData
} from '../lib/firebase/services/vehicleRequestService';

export const useVehicleRequests = (companyId?: string, userId?: string) => {
  const [requests, setRequests] = useState<VehicleRequestWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        let fetchedRequests: VehicleRequestWithCompany[];
        
        // Debug current state
        console.log('useVehicleRequests - Fetching requests:', {
          userRole: user.role,
          userId,
          companyId,
          isAdmin: user.role === 'admin'
        });
        
        if (user.role === 'admin') {
          fetchedRequests = await getAllVehicleRequests();
        } else if (user.role === 'broker') {
          // For brokers, show requests from their invited companies
          console.log('Fetching broker requests for:', user.id);
          fetchedRequests = await getVehicleRequestsByBroker(user.id);
        } else if (userId) {
          // For employees, show only their requests
          console.log('Fetching user requests for:', userId);
          fetchedRequests = await getVehicleRequestsByUser(userId);
        } else if (companyId) {
          // For employers, show all company requests
          console.log('Fetching company requests for:', companyId);
          fetchedRequests = await getVehicleRequestsByCompany(companyId);
        } else {
          // Fallback to user's own requests
          console.log('Fallback: fetching user requests for:', user.id);
          fetchedRequests = await getVehicleRequestsByUser(user.id);
        }

        console.log('Fetched requests:', {
          count: fetchedRequests.length,
          requests: fetchedRequests.map(r => ({
            id: r.id,
            type: r.type,
            userId: r.userId,
            brand: r.brand,
            model: r.model
          }))
        });
        
        setRequests(fetchedRequests);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, companyId]);

  const submitRequest = async (requestData: Omit<VehicleRequest, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const requestId = await createVehicleRequest(requestData);

      // Get company data based on companyId
      const companyData = await getCompanyData(requestData.companyId);

      const newRequest: VehicleRequestWithCompany = {
        ...requestData,
        id: requestId,
        createdAt: new Date(),
        company: companyData,
      };
      setRequests(prev => [newRequest, ...prev]);
      return requestId;
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (requestId: string, newStatus: VehicleRequest['status']) => {
    try {
      await updateVehicleRequestStatus(requestId, newStatus);
      
      // If this is an approval that creates a new order, we need to refetch the requests
      if (newStatus === 'approved' || newStatus === 'salary_conversion_approved') {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        let updatedRequests;
        if (user.role === 'admin') {
          updatedRequests = await getAllVehicleRequests();
        } else if (user.role === 'broker') {
          updatedRequests = await getVehicleRequestsByBroker(user.id);
        } else if (companyId) {
          updatedRequests = await getVehicleRequestsByCompany(companyId);
        } else {
          updatedRequests = await getVehicleRequestsByUser(user.id);
        }
        setRequests(updatedRequests);
      } else {
        // For non-approval status updates, just update the local state
        setRequests(prev => prev.map(request =>
          request.id === requestId
            ? {
                ...request,
                status: newStatus,
                updatedAt: new Date()
              }
            : request
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating request status');
      throw err;
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      await deleteVehicleRequest(requestId);
      setRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting request');
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    submitRequest,
    updateStatus,
    deleteRequest,
  };
};
