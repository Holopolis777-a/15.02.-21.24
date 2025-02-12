import { useState, useEffect } from 'react';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Vehicle } from '../types/vehicle';

export const useVehicleDetail = (id?: string) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) {
        setError('Keine Fahrzeug-ID angegeben');
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'vehicles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() } as Vehicle);
          setError(null);
        } else {
          setError('Fahrzeug nicht gefunden');
          setVehicle(null);
        }
      } catch (err) {
        console.error('Error loading vehicle:', err);
        setError('Fehler beim Laden des Fahrzeugs');
        setVehicle(null);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadVehicle();
  }, [id]);

  const deleteVehicle = async (vehicleId: string) => {
    if (!vehicleId) {
      throw new Error('Keine Fahrzeug-ID angegeben');
    }

    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId));
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      throw new Error('Fehler beim Löschen des Fahrzeugs');
    }
  };

  return { vehicle, isLoading, error, deleteVehicle };
};
