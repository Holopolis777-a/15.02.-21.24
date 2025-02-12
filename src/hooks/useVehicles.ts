import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Vehicle } from '../types/vehicle';
import { useAuthStore } from '../store/authStore';

export type { Vehicle };

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const vehiclesQuery = query(
      collection(db, 'vehicles'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      vehiclesQuery,
      (snapshot) => {
        console.log('Fetching vehicles for user:', {
          userId: user.id,
          role: user.role
        });

        const vehicleData: Vehicle[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // For employer role, only show company and salary vehicles
          if (user.role === 'employer' && data.categories?.includes('standard')) {
            return;
          }
          vehicleData.push({ 
            id: doc.id, 
            ...data 
          } as Vehicle);

          // Debug log each vehicle's data
          console.log('Vehicle data:', {
            id: doc.id,
            brand: data.brand,
            model: data.model,
            categories: data.categories,
            isSalary: data.categories?.includes('salary'),
            basePrice: data.basePrice,
            salaryConversionPrice: data.salaryConversionPrice,
            priceMatrix: data.priceMatrix
          });
        });

        console.log('Total vehicles fetched:', {
          count: vehicleData.length,
          salaryCount: vehicleData.filter(v => v.categories?.includes('salary')).length,
          regularCount: vehicleData.filter(v => !v.categories?.includes('salary')).length
        });

        setVehicles(vehicleData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching vehicles:', err);
        setError('Fehler beim Laden der Fahrzeuge');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const deleteVehicle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      return true;
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      throw new Error('Fehler beim Löschen des Fahrzeugs');
    }
  };

  const duplicateVehicle = async (vehicle: Vehicle) => {
    try {
      // Erstelle eine Kopie des Fahrzeugs ohne ID
      const { id, ...vehicleData } = vehicle;
      
      // Füge das neue Fahrzeug zur Datenbank hinzu
      const docRef = await addDoc(collection(db, 'vehicles'), {
        ...vehicleData,
        createdAt: new Date()
      });
      
      return docRef.id;
    } catch (err) {
      console.error('Error duplicating vehicle:', err);
      throw new Error('Fehler beim Duplizieren des Fahrzeugs');
    }
  };

  return { vehicles, isLoading, error, deleteVehicle, duplicateVehicle };
};
