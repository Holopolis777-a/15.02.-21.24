import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/db';

interface DashboardStats {
  activeVehicles: number;
  openRequests: number;
  activeCompanies: number;
  activeUsers: number;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeVehicles: 0,
    openRequests: 0,
    activeCompanies: 0,
    activeUsers: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch active vehicles from all stores
        const vehiclesQuery = query(collection(db, 'vehicles'), where('status', '==', 'active'));
        const vehiclesSnapshot = await getDocs(vehiclesQuery);
        const activeVehicles = vehiclesSnapshot.size;

        // Fetch open requests (all types with 'pending' status)
        const requestsQuery = query(collection(db, 'vehicleRequests'), where('status', '==', 'pending'));
        const requestsSnapshot = await getDocs(requestsQuery);
        const openRequests = requestsSnapshot.size;

        // Fetch active companies
        const companiesQuery = query(collection(db, 'companies'), where('status', '==', 'active'));
        const companiesSnapshot = await getDocs(companiesQuery);
        const activeCompanies = companiesSnapshot.size;

        // Fetch all active users
        const usersQuery = query(collection(db, 'users'), where('status', '==', 'active'));
        const usersSnapshot = await getDocs(usersQuery);
        const activeUsers = usersSnapshot.size;

        setStats({
          activeVehicles,
          openRequests,
          activeCompanies,
          activeUsers,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch dashboard statistics',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
