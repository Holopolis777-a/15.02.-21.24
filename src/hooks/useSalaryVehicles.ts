import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Vehicle } from '../types/vehicle';

export const useSalaryVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Query für Fahrzeuge mit der Kategorie 'salary'
    const vehiclesQuery = query(
      collection(db, 'vehicles'),
      where('categories', 'array-contains', 'salary'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      vehiclesQuery,
      (snapshot) => {
        const vehicleData: Vehicle[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          vehicleData.push({ 
            id: doc.id, 
            ...data 
          } as Vehicle);
        });

        setVehicles(vehicleData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching salary vehicles:', err);
        setError('Fehler beim Laden der Gehaltsumwandlungsfahrzeuge');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { vehicles, isLoading, error };
};
