import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Vehicle } from '../types/vehicle';
import { useAuthStore } from '../store/authStore';

export const useVehicleForm = (id?: string) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) {
        setVehicle(null);
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'vehicles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const vehicleData = {
            ...docSnap.data(),
            id // Always use the ID from the URL
          } as Vehicle;
          
          setVehicle(vehicleData);
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

  const saveVehicle = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (!user?.id) {
        throw new Error('Benutzer nicht authentifiziert');
      }

      const timestamp = new Date().toISOString();
      
      // Always use the existing ID from the URL or the current vehicle data
      const vehicleId = id || vehicleData.id;
      
      if (!vehicleId) {
        throw new Error('Keine Fahrzeug-ID vorhanden');
      }

      // Prepare data for saving
      const dataToSave = {
        ...vehicleData,
        updatedAt: timestamp,
        updatedBy: user.id,
        ...(id ? {} : { createdAt: timestamp, createdBy: user.id })
      };

      // Remove the id before saving to Firestore
      const { id: _, ...dataWithoutId } = dataToSave;

      const docRef = doc(db, 'vehicles', vehicleId);
      await setDoc(docRef, dataWithoutId, { merge: true });
      
      return vehicleId;
    } catch (err) {
      console.error('Error saving vehicle:', err);
      throw new Error('Fehler beim Speichern des Fahrzeugs');
    }
  };

  return { vehicle, isLoading, error, saveVehicle };
};